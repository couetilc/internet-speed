FROM node:12 as build
WORKDIR /home/speedtest
ENV NODE_ENV=production
RUN export SPEEDTEST_VERSION="1.0.0" && \
    export SPEEDTEST_ARCH="x86_64" && \
    export SPEEDTEST_PLATFORM="linux" && \
    mkdir -p bin && \
    curl -Ss -L "https://ookla.bintray.com/download/ookla-speedtest-$SPEEDTEST_VERSION-$SPEEDTEST_ARCH-$SPEEDTEST_PLATFORM.tgz" | tar -zx -C /home/speedtest/bin && \
    chmod +x bin/speedtest
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ src/
RUN npm run build:parcel

FROM node:12 as app
WORKDIR /home/speedtest
COPY --from=build /home/speedtest .
# RUN chmod -R 777 /home/speedtest
# RUN chown -R node:node /home/speedtest
# USER node

CMD ["node", "src/index.js"]
