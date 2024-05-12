FROM node:20-alpine3.19 AS base

# build args
ARG GH_CLIENT_ID
ARG GH_CLIENT_SECRET
ARG DATABASE_URL
ARG PORT

# set env
ENV GH_CLIENT_ID $GH_CLIENT_ID
ENV GH_CLIENT_SECRET $GH_CLIENT_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV PORT $PORT

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
EXPOSE $PORT