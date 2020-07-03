# Introduction

This program is a modification of [Brennent Smith's](https://github.com/brennentsmith)
[internet-speed-logger](https://github.com/brennentsmith/internet-speed-logger)
application, using [SQLite](https://www.sqlite.org) instead of [MongoDB](https://www.mongodb.com/).

# Development

Update the docker container
`docker build -t speedtest .`

Run the container
`docker run speedtest`

Run the container with persisted data
`docker-compose up`
