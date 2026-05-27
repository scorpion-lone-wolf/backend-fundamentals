# Use an official Node.js runtime as the build base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package manifest files first to leverage Docker cache for dependency install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code into the container
COPY . .

# Document the port the app listens on
# Note: exposing a port is informational. The container port is published to the host with docker run -p.
EXPOSE 3000

# Start the application
CMD ["npm","run","dev"]


