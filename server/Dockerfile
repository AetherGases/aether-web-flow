FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production
USER node
EXPOSE 3001
# Every pod loads the shared aether-env Secret: pin host/port and reuse its REDIS_URI.
CMD ["sh", "-c", "HOST=0.0.0.0 PORT=3001 REDIS_URL=\"${REDIS_URL:-$REDIS_URI}\" exec node src/index.ts"]
