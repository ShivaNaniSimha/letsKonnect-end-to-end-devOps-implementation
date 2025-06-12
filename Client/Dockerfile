# Step 1: Build React app with Node.js 18
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built files from the build stage
COPY --from=build /app/build .

# Expose port 80 to the host
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]


