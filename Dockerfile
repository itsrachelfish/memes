FROM node:8-alpine

WORKDIR /app

COPY . /app
COPY ./src/js/config.example.js /app/src/js/config.js

RUN apk add --no-cache --virtual .gyp \
	git \
	make \
	g++ \
	python \
	&& npm install \
	&& apk del .gyp \ 
	&& npm install --global gulp@3.9.1 \
	&& npm link gulp

EXPOSE 8080 
ENTRYPOINT [ "gulp" ]
