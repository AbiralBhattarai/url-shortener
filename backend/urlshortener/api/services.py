import hashlib
from .models import *

def generate_short_url(url:str,length:int=6)->str:
    counter = 0
    while True:
        salt = url+str(counter)
        short = hashlib.sha256(salt.encode()).hexdigest()[:length]

        if not ShortURL.objects.filter(shortened_url = short).exists():
            return short
        count+=1