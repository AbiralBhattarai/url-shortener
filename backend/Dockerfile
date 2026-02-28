FROM python:3.12-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache bash postgresql-client gcc musl-dev libpq-dev

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Change to Django project directory
WORKDIR /app/urlshortener

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "urlshortener.wsgi", "--bind", "0.0.0.0:8000", "--workers", "4"]
