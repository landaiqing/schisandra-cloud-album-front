# 设置基础镜像
FROM nginx:latest
# 设置作者信息
LABEL maintainer="landaiqing <<landaiqing@126.com>>"
# 设置时区
ENV TimeZone=Asia/Shanghai
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY dist/  /usr/share/nginx/html/
# 用本地的 default.conf 配置来替换nginx镜像里的默认配置
COPY default.conf /etc/nginx/conf.d/default.conf
# 暴露80端口
EXPOSE 80
