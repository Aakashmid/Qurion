from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json
from .models import Message
import asyncio
from openai import OpenAI
from decouple import config

# Load environment variables from .env file

# Set OpenAI API key

base_url = config('OPENAI_BASE_URL')
api_key = config('OPENAI_API_KEY')

api = OpenAI(api_key=api_key, base_url=base_url)
async def get_question_response(request_text):
    completion = api.chat.completions.create(
          model="o3-mini",
          messages=[
              {"role": "system", "content": "you are a helpful assistant."},
              {"role": "user", "content": request_text},
          ],
          max_tokens=256,
    )
    return completion.choices[0].message.content



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['request_text']
        self.room_group_name = 'chat_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        request_text = text_data_json['request_text']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'request_text':request_text
            })
        

    async def chat_message(self, event):
        request_text = event['request_text']
        await self.send(text_data=json.dumps({
            'request_text': request_text
        }))

        response_text =  await get_question_response(request_text)

        await self.send(text_data=json.dumps({
            'response_text': response_text
        }))

        # Save message to database
        await self.save_message(request_text, response_text)


    @sync_to_async
    def save_message(self, request_text, response_text):
        Message.objects.create(request_text=request_text, response_text=response_text)


