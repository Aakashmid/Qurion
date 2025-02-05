from rest_framework.response import Response

# Create your views here.
from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Message


# serializer for chat messages
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


@api_view(['GET'])
def get_messages(request):
    messages = Message.objects.all()
    serializer = MessageSerializer(messages, many=True)
    return Response({'messages': serializer.data})
