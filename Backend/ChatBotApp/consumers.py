from channels.generic.websocket import AsyncWebsocketConsumer
from .serializers import MessageSerializer, MessageSerilizerForChatHistory
from asgiref.sync import sync_to_async
import json
from .models import Message, Conversation
import asyncio
from openai import OpenAI
from decouple import config

from azure.ai.inference.aio import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model_name = "openai/gpt-4.1"
token = config("GITHUB_TOKEN")

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

conversation_histories = {}  # for conversation history for remembering the chat for ai

# --- Use asyncio.Event for per-connection streaming stop ---
stop_events = {}  # {room_name: asyncio.Event}

# --- Async generator, now accepts stop_event for cancellation ---
async def get_question_response(request_question, token, stop_event):
    if token not in conversation_histories:
        conversation_histories[token] = []
        messages = await get_conversation_message(token)
        if messages:
            conversation_histories[token].extend(messages)

    conversation_histories[token].append(UserMessage(request_question))
    messages = [SystemMessage("You are a helpful assistant.")] + conversation_histories[token]

    try:
        response = await client.complete(
            messages=messages,
            temperature=1.0,
            top_p=1.0,
            max_tokens=1000,
            model=model_name,
            stream=True
        )

        async for chunk in response:
            # Check stop event FIRST before processing each chunk
            if stop_event.is_set():
                print("Stop detected in generator")
                # Try to close the response if possible
                if hasattr(response, 'aclose'):
                    await response.aclose()
                elif hasattr(response, 'close'):
                    await response.close()
                return  # Exit the generator immediately
                
            content = chunk.choices[0].delta.content
            if content:
                yield content
                
            # Check stop event AGAIN after yielding
            if stop_event.is_set():
                print("Stop detected after yield")
                return
                
            await asyncio.sleep(0.01)  # Small delay to make stop more responsive
    except asyncio.CancelledError:
        print("Generator cancelled")
        raise
    except Exception as e:
        print(f"Error in streaming: {e}")
        yield f"Error: {str(e)}"

@sync_to_async(thread_sensitive=True)
def get_conversation_message(token):
    try:
        messages = Message.objects.filter(conversation__token=token).order_by('timestamp').values('request_text', 'response_text')
        serialized_messages = MessageSerilizerForChatHistory(messages, many=True).data
        flattened_messages = [{"role": "user", "content": message["request_text"]} for message in serialized_messages] + [
            {"role": "system", "content": message["response_text"]} for message in serialized_messages
        ]
        return flattened_messages
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return []

@sync_to_async
def get_conversation(token):
    try:
        return Conversation.objects.get(token=token)
    except Conversation.DoesNotExist:
        return None

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stream_task = None  # Holds the current streaming task

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['conversation_token']
        self.room_group_name = 'chat_%s' % self.room_name
        try:
            conversation = await get_conversation(self.room_name)
            if not conversation:
                await self.send(text_data=json.dumps({'error': 'Invalid conversation token'}))
                await self.close(code=4001)
                return
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        except Exception as e:
            await self.close()
            print(f"Error during connection: {e}")

    async def disconnect(self, close_code):
        # Set stop event if it exists
        if self.room_name in stop_events:
            stop_events[self.room_name].set()
            del stop_events[self.room_name]
            
        # Cancel any running streaming task
        if self.stream_task and not self.stream_task.done():
            self.stream_task.cancel()
            try:
                await self.stream_task
            except asyncio.CancelledError:
                pass  # Expected when cancelling
                
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'stop_streaming':
            print('stop streaming is called in server')
            # Signal the event to stop streaming
            if self.room_name in stop_events:
                stop_events[self.room_name].set()
                # Send immediate confirmation that stopping was requested
                await self.send(text_data=json.dumps({
                    'message': 'Stopping stream', 
                    'type': 'stopping_stream'
                }))
            # Cancel the streaming task if running
            if self.stream_task and not self.stream_task.done():
                self.stream_task.cancel()
                # Await the cancelled task to ensure proper cleanup
                try:
                    await self.stream_task
                except asyncio.CancelledError:
                    pass  # This is expected
            return

        request_text = text_data_json['request_text']
        # Create a new stop event for this stream
        stop_event = asyncio.Event()
        stop_events[self.room_name] = stop_event

        # Start streaming as a separate task
        self.stream_task = asyncio.create_task(
            self.handle_streaming(request_text, stop_event)
        )

    async def handle_streaming(self, request_text, stop_event):
        await self.channel_layer.group_send(
            self.room_group_name,
            {'type': 'chat_message', 'request_text': request_text}
        )

    async def chat_message(self, event):
        request_text = event['request_text']
        await self.send(text_data=json.dumps({'request_text': request_text, 'type': 'request_text'}))
        response_text = ""
        stop_event = stop_events.get(self.room_name)
        
        try:
            async for chunk in get_question_response(request_text, self.room_name, stop_event):
                # Check if streaming should stop FIRST
                if stop_event and stop_event.is_set():
                    await self.send(text_data=json.dumps({
                        'message': 'Chat stopped', 
                        'type': 'streaming_stopped'
                    }))
                    print('Streaming stopped - event detected')
                    break
                    
                response_text += chunk
                await self.send(text_data=json.dumps({
                    'response_text': chunk, 
                    'type': 'response_chunk'
                }))
                
                # Check if streaming should stop AGAIN
                if stop_event and stop_event.is_set():
                    await self.send(text_data=json.dumps({
                        'message': 'Chat stopped', 
                        'type': 'streaming_stopped'
                    }))
                    print('Streaming stopped - event detected after sending chunk')
                    break
                    
            # Only send complete response if we weren't stopped
            if not (stop_event and stop_event.is_set()):
                await self.send(text_data=json.dumps({
                    'response_text': response_text, 
                    'type': 'response_complete'
                }))
                
                # Only save if streaming completed normally
                if response_text:
                    try:
                        await self.save_message(request_text, response_text, conversation_token=self.room_name)
                    except ValueError as e:
                        await self.send(text_data=json.dumps({'error': str(e)}))
        except asyncio.CancelledError:
            await self.send(text_data=json.dumps({
                'message': 'Chat stopped', 
                'type': 'streaming_stopped'
            }))
            print('Streaming task was cancelled')
        except Exception as e:
            response_error = "Sorry, an error occurred while processing your request."
            print(f"Error getting response: {e}")
            await self.send(text_data=json.dumps({'message': response_error, 'type': 'error'}))
        finally:
            # Always clean up stop_event to prevent memory leaks
            if self.room_name in stop_events:
                del stop_events[self.room_name]

    @sync_to_async
    def save_message(self, request_text, response_text, conversation_token):
        try:
            conversation = Conversation.objects.get(token=conversation_token)
            Message.objects.create(conversation=conversation, request_text=request_text, response_text=response_text)
        except Conversation.DoesNotExist:
            raise ValueError('Conversation not found')
        except Exception as e:
            raise ValueError(f'Error saving message: {str(e)}')