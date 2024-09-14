FROM node:20.17.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port (adjust if necessary)
EXPOSE 4000

# Command to run the application
CMD DEBUG=playground:* npm run dev