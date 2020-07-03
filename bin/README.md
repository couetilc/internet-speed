download the speedtest executable and place it in the bin directory to run
scripts out of docker

Example:

```sh
# download
SPEEDTEST_VERSION="1.0.0"
SPEEDTEST_ARCH="x86_64"
SPEEDTEST_PLATFORM="linux"
curl -Ss -L "https://ookla.bintray.com/download/ookla-speedtest-$SPEEDTEST_VERSION-$SPEEDTEST_ARCH-$SPEEDTEST_PLATFORM.tgz" | tar -zx -C ./bin

# run
chmod +x bin/speedtest
./bin/speedtest
```
