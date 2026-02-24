import hashlib
from ..models import *

def generate_short_url(url:str,length:int=6)->str:
    counter = 0
    while True:
        salt = url+str(counter)
        short = hashlib.sha256(salt.encode()).hexdigest()[:length]

        if not ShortURL.objects.filter(shortened_url = short).exists():
            return short
        count+=1


def get_client_ip(request):
        ip = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip:
            return ip.split(",")[0]
        return request.META.get("REMOTE_ADDR")
