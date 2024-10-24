FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy the environment variables file
COPY .env.local .env.local

# Generate the Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
