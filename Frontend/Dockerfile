FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Create production build
RUN npm run build

# Production stage
FROM nginx:alpine

# Install envsubst utility using Alpine's package manager
RUN apk add --no-cache gettext

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config template
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

# Set default backend URL (will be overridden in Azure)
ENV BACKEND_URL=http://localhost:5000

# Expose port
EXPOSE 80

# Use /bin/sh instead of /bin/bash for Alpine compatibility
CMD /bin/sh -c "envsubst '\$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"