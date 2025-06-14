from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status, viewsets,permissions

from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django.db.models import Max


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def server_status(request):
    return Response({'status': 'ok'}, status=status.HTTP_200_OK)



@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_conversation_messages(request, token):
    try:
        conversation = Conversation.objects.get(token=token, user=request.user)
        if not conversation:
            raise Http404("Conversation not found or you do not have permission to access it.")
        messages = conversation.messages.all().order_by('-timestamp')
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_messages = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    lookup_field = 'token'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','messages__request_text']

    def get_queryset(self):
        # Annotate each conversation with the latest message timestamp and order by creation, update, or message activity
        return (
            self.request.user.conversations.all()
            .annotate(
                latest_message_time=Max('messages__timestamp')  # Annotate with the latest message timestamp
            )
            .order_by('-latest_message_time', '-updated_at', '-created_at') 
        )