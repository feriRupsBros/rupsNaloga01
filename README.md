# Deployment Instructions

**NOTE:** For testing purposes, you can skip these steps, but SSL won't work.

This website is hosted on `rups.ddns.net`, which is a free domain obtained from [No-Ip](https://www.noip.com/). Ensure that the domain points to your host.

Your host must expose ports `80` and `443` (Port forwarding is also required).

```bash
$ sudo ufw allow 80
$ sudo ufw allow 443
```

In the `docker-compose.yaml`, replace every instance of `rups.ddns.net` with your own domain.

Additionally, consider changing the username and password for MongoDB:

```yaml
environment:
    MONGO_INITDB_ROOT_USERNAME: secret
    MONGO_INITDB_ROOT_PASSWORD: secret
```

Also, update the JWT secrets:

```yaml
environment:
    DATABASE_URL: mongodb://secret:secret@mongodb:27017
    JWT_SECRET: secret
```

To start the server, run:

```bash
$ sudo docker-compose up --build
```

**NOTE:** SSL activation may take some time. If the SSL certificate is invalid, wait for a bit. Keep in mind that this proxy, especially the SSL part, may not work on localhost.

## Running the Scraper

First, update the `scraper/docker-compose.yaml` to point to the server URL:

```yaml
API_URL: https://rups.ddns.net
```

To run the scraper, execute the following commands:

```bash
$ cd scraper
$ sudo docker-compose up --build
```