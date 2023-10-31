# This is text file that will define all the Docker instructions necessary for Docker Engine to build an image of your service

########################################################################################################################
# Stage 0: Install the base dependencies
# So don't need to constantly download and reinstall dependencies every time I want to rebuild the site

# specifies the parent (or base) image to use as a starting point for our own image
# our fragments image will be based on other Docker images
FROM node:18.17.1@sha256:933bcfad91e9052a02bc29eb5aa29033e542afac4174f9524b79066d97b23c24 AS dependencies

# Use /app as our working directory
# create the /app directory, since it won't exist, and then enter it (i.e., cd /app)
WORKDIR /app

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

# execute a command and cache this layer
# Install node dependencies defined in package-lock.json
RUN npm install

########################################################################################################################

# Stage 1: Run the site
FROM node:18.17.1@sha256:933bcfad91e9052a02bc29eb5aa29033e542afac4174f9524b79066d97b23c24 AS build

ENV NODE_ENV=production

# define some metadata about your image (who is mainting this image, what this image is used for)
LABEL maintainer="Katie Liu <kliu57@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# define any environment variables you want to include
# We default to use port 8080 in our service
ENV PORT=8080
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

# Copy the generated dependencies (node_modules/)
COPY --from=dependencies /app /app

# Copy the source code
COPY . .

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# define the command to run in order to start our container
# Start the container by running our server
CMD npm start

# indicate the port(s) that a container will listen on when run
# We run our service on port 8080
EXPOSE 8080

# Automated Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1

########################################################################################################################
