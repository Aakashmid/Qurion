from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework import status, viewsets
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter


@api_view(['GET'])
def server_status(request):
    return Response({'status': 'ok'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@extend_schema(
    parameters=[
        OpenApiParameter(name='token', description='Conversation token', required=True, type=str),
    ],
    responses={
        200: ConversationSerializer,
        400: 'Bad Request',
    },
)


def get_conversation_messages(request, token):
    try:
        messages = Message.objects.filter(conversation__token=token).order_by('timestamp')
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
    ordering = ['-updated_at', '-created_at']
    filter_backends = [OrderingFilter]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def get_object(self):
        token = self.kwargs.get('token')
        try:
            return self.get_queryset().get(token=token)
        except Conversation.DoesNotExist:
            raise Http404("Conversation not found")        