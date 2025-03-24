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
        fields = ['id','user_id','token','name','created_at', 'updated_at']  # Exclude the default 'id' field


    def create(self, validated_data):
        # Automatically set the user_id to the authenticated user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user_id'] = request.user.id
        return super().create(validated_data)
    

class MessageSerilizerForChatHistory(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['request_text', 'response_text']
