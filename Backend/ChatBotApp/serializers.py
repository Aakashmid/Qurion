from rest_framework import serializers
from .models import Conversation , Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ConversationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(read_only=True)
    class Meta:
        model = Conversation
        fields = ['id','token','name','created_at', 'updated_at']  # Exclude the default 'id' field