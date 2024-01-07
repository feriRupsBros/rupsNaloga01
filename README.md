# Instructions for deployment

**NOTE**: For testing purposes you can skip these steps but SSL wont work.

This website is hosted on rups.ddns.net whitch is a free domain we got from [No-Ip](https://www.noip.com/).
The domain has to  point to your host.

Your host has to expose port `80` and `433` (Port forwading is also required)
```Bash
$ sudo ufw allow 80
$ sudo ufw allow 443
```

In the docker-compose.yaml you also have to replace every instance of `rups.ddns.net` with your own domain. 

And maybe change up teh username and password for mongodb 
```YML
environment:
    MONGO_INITDB_ROOT_USERNAME: seceret
    MONGO_INITDB_ROOT_PASSWORD: seceret
```
and the JWT secerets
```YML
environment:
    DATABASE_URL: mongodb://seceret:seceret@mongodb:27017
    JWR_SECERET: seceret
```


Then to start up teh server you run

```Bash
$ sudo docker-compose up
```

*NOTE*: The SSL takes a while to activate so if teh SSL certificate is invalid wait for a bit.
*NOTE*: This proxy or at least the SSL part doesnt work on localhost