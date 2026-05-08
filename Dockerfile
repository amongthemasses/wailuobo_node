FROM node:22.22.2

WORKDIR /wailuobo_node

COPY ./* ./

RUN chmod -R 777 /wailuobo_node

RUN npm install --registry=https://registry.npmmirror.com

CMD ["npm","start"]
