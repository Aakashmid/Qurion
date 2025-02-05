from channels.generic.websocket import AsyncWebsocketConsumer
import json


async def get_question_response(question_text):
    return "This is the response to the question: " + question_text

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
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
        question_text = text_data_json['question_text']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'question_text':question_text
            })
        

    async def chat_message(self, event):
        question_text = event['question_text']
        await self.send(text_data=json.dumps({
            'question_text': question_text
        }))

        response_text =  await get_question_response(question_text)

        await self.send(text_data=json.dumps({
            'response_text': response_text
        }))


        # save message to database , call function to save message to database
            # Save message to database
        await self.save_message(username, self.room_name, message)

