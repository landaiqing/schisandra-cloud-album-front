
FROM nginx:alpine

LABEL maintainer="landaiqing <<landaiqing@126.com>>"

ENV TimeZone=Asia/Shanghai

# 创建空目录用于后续挂载
RUN mkdir -p /usr/share/nginx/html/tfjs \
    && mkdir -p /usr/share/nginx/html/caffemodel \
    && mkdir -p /etc/nginx/conf.d

COPY dist/  /usr/share/nginx/html/

# 强制删除模型目录（确保后续挂载覆盖）
RUN rm -rf /usr/share/nginx/html/tfjs \
    && rm -rf /usr/share/nginx/html/caffemodel \
    && rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80

#docker run -d \
#  -v /your_host/nginx.conf:/etc/nginx/nginx.conf \
#  -v /your_host/conf.d/:/etc/nginx/conf.d/ \
#  -v /your_host/tfjs:/usr/share/nginx/html/tfjs \
#  -v /your_host/caffemodel:/usr/share/nginx/html/caffemodel \
#   --restart unless-stopped \
#  -p 80:80 \
#  --name your_image
#  your_image
