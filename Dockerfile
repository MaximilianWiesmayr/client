FROM nginx:1.17.8-alpine

MAINTAINER Sebastian Schiefermayr <sebastian.schiefermayr@gmx.at>

EXPOSE 80 443

COPY dist/InstantGrade-Client/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
