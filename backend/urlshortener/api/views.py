from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ShortURL
from .utils.services import generate_short_url

# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ShortURL
from .utils.services import generate_short_url

# Create your views here.


class CreateShortURLView(APIView):
    def post(self, request):
        original_url = request.data.get('original_url')
        
        if not original_url:
            return Response(
                {'error': 'original_url is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # generate short url
        shortened_url = generate_short_url(original_url)
        
        # save to db
        short_url_obj = ShortURL.objects.create(
            original_url=original_url,
            shortened_url=shortened_url
        )
        
        return Response({
            'id': short_url_obj.id,
            'original_url': short_url_obj.original_url,
            'shortened_url': short_url_obj.shortened_url,
            'created_at': short_url_obj.created_at
        }, status=status.HTTP_201_CREATED)
