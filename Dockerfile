# --- Stage 1: Build the React application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the production-ready static assets
RUN npm run build

# --- Stage 2: Serve the static files using Nginx ---
FROM nginx:alpine

# Remove the default Nginx index page and configurations
RUN rm -rf /usr/share/nginx/html/* && rm /etc/nginx/conf.d/default.conf

# Copy built static assets from the builder stage
# (Vite builds into 'dist' folder by default)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration to support SPA routing and backend API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

