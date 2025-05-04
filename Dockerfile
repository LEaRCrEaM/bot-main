FROM node:18-slim

# Install dependencies for Puppeteer to run Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy dependencies and install them
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Set environment variables for Puppeteer and Node.js
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
ENV NODE_ENV=production

CMD ["node", "index.js"]
