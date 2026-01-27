#use offivial nodejs image as base image
FROM node:16-alpine

#set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

#install dependencies
RUN npm install

# Copy the rest of the application code also use COPY . .
COPY app.js ./

# Expose the port your app listens on
EXPOSE 3000

#start app
CMD ["npm", "start"]