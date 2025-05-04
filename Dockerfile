# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./ 
RUN npm ci

# Copy application code
COPY . . 

# Final stage for app image
FROM base

# Install packages needed for deployment (including Chromium and sandbox)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    chromium chromium-sandbox libnss3 libgdk-pixbuf2.0-0 libatk1.0-0 libatk-bridge2.0-0 \
    libx11-xcb1 libxcomposite1 libxrandr2 xdg-utils fonts-liberation \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Set the path for Puppeteer to find Chromium
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

# Copy built application
COPY --from=build /app /app

# Expose port 3000 and start the app
EXPOSE 3000
CMD [ "npm", "run", "start" ]
