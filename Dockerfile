FROM node:20-alpine3.19 AS base

# build args
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG DATABASE_URL

# set env
ENV GITHUB_CLIENT_ID $GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET $GITHUB_CLIENT_SECRET
ENV DATABASE_URL $DATABASE_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run check
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
EXPOSE 8080