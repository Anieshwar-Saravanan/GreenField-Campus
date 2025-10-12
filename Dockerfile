# Multi-stage Dockerfile for Vite React app
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN npm ci --silent || true

# Copy source
COPY . .

# Build-time args for Vite environment variables (these are baked into the build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Build
RUN npm ci --silent && npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx conf with SPA-friendly one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
