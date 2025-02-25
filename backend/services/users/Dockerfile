FROM node:18

WORKDIR /backend

# Copier les fichiers package.json depuis backend (le contexte du build)
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "services/users/server.js"]
