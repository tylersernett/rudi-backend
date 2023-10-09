# Dockerfile
FROM node:18

#set working directory
WORKDIR /usr/src/app

#copy all files with permissions tweak
COPY --chown=node:node . .

#do a 'clean install'
RUN npm ci 

ENV NODE_ENV=production
ENV PORT=8080
  
USER node
EXPOSE 8080
CMD ["npm", "run", "start"]