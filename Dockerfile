
FROM nginx:latest

LABEL maintainer="landaiqing <<landaiqing@126.com>>"

ENV TimeZone=Asia/Shanghai

COPY dist/  /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
