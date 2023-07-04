# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./


# Install app dependencies
RUN npm ci

# Copy the rest of the application code to /app
COPY . .

# Define the command to run the app
CMD ["npm", "start"]
