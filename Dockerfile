FROM node:24.18.0-bookworm-slim AS build

WORKDIR /workspace

COPY . .

RUN npm ci

ARG VITE_API_BASE_URL
ARG VITE_APP_THEME=theme1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_THEME=${VITE_APP_THEME}

RUN test -n "$VITE_API_BASE_URL" \
  && npm run build

FROM nginxinc/nginx-unprivileged:1.29.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /workspace/apps/gopro/dist/ /usr/share/nginx/html/

USER 101:101
EXPOSE 8080
