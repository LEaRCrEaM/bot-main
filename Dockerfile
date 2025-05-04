FROM ghcr.io/puppeteer/puppeteer:21.3.8

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Set environment variables for Puppeteer and Node.js
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["node", "index.js"]
