# Base Image
FROM nginx:1.17.8-alpine
# Expose http & https ports to the public
EXPOSE 80 443
# Data Directory for our HTML Files
ENV DATA_DIR /var/www/html
# /usr/share/nginx/html
RUN mkdir /home/server/ && mkdir /home/server/uploads
# Add custom config
ADD ./conf /etc/nginx/conf.d/
# Copy the project files and serve it through nginx
COPY dist/InstantGrade-Client/ $DATA_DIR
