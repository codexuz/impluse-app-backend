# Dockerfile
FROM node:20

WORKDIR /app

# Install FFmpeg for video compression
# RUN apt-get update && \
#     apt-get install -y ffmpeg && \
#     rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]
