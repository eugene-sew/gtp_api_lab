FROM node:20-alpine

# Add build dependencies for Prisma
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package.json ./
COPY prisma ./prisma/

COPY .env ./
# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=80

# Add wait-for script to handle database connection
RUN wget -O wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x wait-for

CMD ["sh", "-c", "npm run db:deploy && npm run start:dev"]