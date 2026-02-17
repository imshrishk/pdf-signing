FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application code
COPY src ./src
COPY scripts ./scripts
COPY certs ./certs
COPY public ./public

# Create upload directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r)=>{if(r.statusCode!==200) throw new Error()})"

# Start server
CMD ["node", "src/server.js"]
