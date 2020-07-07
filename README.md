# Introduction

This program is a modification of [Brennent Smith's](https://github.com/brennentsmith)
[internet-speed-logger](https://github.com/brennentsmith/internet-speed-logger)
application, using [SQLite](https://www.sqlite.org) instead of [MongoDB](https://www.mongodb.com/).

# Development

// TODO how to do rapid development of run test script, and web app visualizer?

Update the docker container
`docker build -t speedtest .`

Run the container
`docker run speedtest`

Run the container with persisted data
`docker-compose up`

To print the prod config to stdout:
`docker-compose -f docker-compose.yml config`

To print the dev config to stdout:
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml config`
