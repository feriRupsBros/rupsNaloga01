FROM python:3.8.3-slim-buster

COPY --chown=node:node . /src
WORKDIR /src
RUN pip install -r requirements.txt

CMD [ "python", "/src/AirPollutionXMLScrapper.py" ]
