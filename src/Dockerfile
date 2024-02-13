FROM node:16.15.0-alpine AS development
ENV INSTALL_PATH /usr/src/app

WORKDIR $INSTALL_PATH

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ src
COPY scripts/ scripts 

RUN npm run build

# production

FROM node:16.15.0-alpine AS production

ENV INSTALL_PATH /usr/src/app

WORKDIR $INSTALL_PATH

COPY package*.json ./

RUN npm ci --production

COPY --from=development $INSTALL_PATH/src $INSTALL_PATH/src
COPY --from=development $INSTALL_PATH/dist $INSTALL_PATH/dist

ENTRYPOINT ["node", "./dist/app.js"]

