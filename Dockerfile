FROM risingstack/alpine:3.4-v6.9.4-4.2.0

ENV PORT 3001

EXPOSE 3001

COPY package.json package.json
RUN npm install

COPY node-typescript-starter-master .
RUN npm run build

CMD ["node", "dist/"]
