# Dockerfile for Expo React Native Frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Expo port
EXPOSE 8081

# Start Expo server
CMD ["expo", "start", "--tunnel", "--no-interactive"]
