FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project
COPY . .

EXPOSE 5173

# Run development server
CMD ["npm", "run", "dev", "--", "--host"]
