# Build
FROM node:22-alpine AS build-stage

# set main folder inside container
WORKDIR /app

# copy file package.json
COPY package*.json ./

# install dependecies
RUN npm install

# copy all file project
COPY . .

# set environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# build project
RUN npm run build

#  -- PRODUCTION --
FROM nginx:stable-alpine

# copy file build to nginx folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# copy file nginx.conf to nginx folder
COPY nginx.conf /etc/nginx/conf.d/default.conf

# port running on nginx
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]