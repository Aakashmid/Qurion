from rest_framework.response import Response
from django.http import Http404
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework import status , viewsets
from .models import Message , Conversation
from .serializers import MessageSerializer , ConversationSerializer


# serializer for chat messages

@api_view(['GET'])
def get_conversation(request, token):
    try:
        messages = Message.objects.filter(conversation_token=token).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    def retrieve(self, request, *args, **kwargs):
        token = kwargs.get('pk')
        try:
            conversation = Conversation.objects.get(token=token)
        except Conversation.DoesNotExist:
            raise Http404
        serializer = self.get_serializer(conversation)
        return Response(serializer.data)