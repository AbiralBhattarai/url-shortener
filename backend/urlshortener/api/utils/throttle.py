from rest_framework.throttling import BaseThrottle
from django.core.cache import cache
from .services import get_client_ip


class AtomicIPRateThrottle(BaseThrottle):
    RATE_LIMIT = 5 #limit per window
    WINDOW = 60  # seconds

    def allow_request(self, request):
        self.ip = get_client_ip(request)
        self.key = f"rate_limit:{self.ip}"

        try:
            current_count = cache.incr(self.key)
        except ValueError:
            cache.set(self.key, 1, timeout=self.WINDOW)
            return True

        if current_count == 1:
            cache.expire(self.key, self.WINDOW)

        if current_count > self.RATE_LIMIT:
            return False

        return True

    def wait(self):
        return cache.ttl(self.key)
