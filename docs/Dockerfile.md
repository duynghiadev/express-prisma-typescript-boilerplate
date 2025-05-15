# Dockerfile Explanation

This document explains the `Dockerfile` used to build a Docker image for the Express-Prisma-TypeScript-Boilerplate project. The `Dockerfile` sets up a Node.js environment, installs dependencies, and configures the application to run in a container.

## Configuration Breakdown

### 1. `FROM node:16-alpine3.14`

- Specifies the base image as `node:16-alpine3.14`, which is a lightweight Node.js 16 image based on Alpine Linux 3.14.
- The `alpine` variant is chosen for its small size, reducing the overall image footprint.

### 2. `EXPOSE 3000`

- Declares that the container will listen on port 3000 at runtime.
- This does not actually publish the port; it serves as documentation and is used by `docker-compose` or `docker run` to map ports.

### 3. `ARG NODE_ENV`

- Defines a build-time argument `NODE_ENV`, which can be passed when building the image (e.g., `development` or `production`).
- Allows dynamic configuration of the environment during the build process.

### 4. `ENV NODE_ENV $NODE_ENV`

- Sets the `NODE_ENV` environment variable inside the container to the value provided during the build.
- This variable is commonly used to control application behavior (e.g., enabling/disabling development features or optimizations).

### 5. `RUN mkdir /app`

- Creates a directory named `/app` inside the container to serve as the working directory for the application.

### 6. `WORKDIR /app`

- Sets `/app` as the working directory for subsequent instructions in the `Dockerfile`.
- All following commands (e.g., `ADD`, `RUN`, `CMD`) will execute relative to this directory.

### 7. `ADD package.json yarn.lock .env /app/`

- Copies the `package.json`, `yarn.lock`, and `.env` files from the project root to the `/app` directory in the container.
- These files are added first to leverage Docker’s layer caching, ensuring that dependencies are only reinstalled if these files change.

### 8. `ADD . /app`

- Copies the entire project directory (all files and folders) to the `/app` directory in the container.
- This includes the application source code, configuration files, and any other necessary files.

### 9. `RUN yarn --pure-lockfile`

- Installs the project dependencies using Yarn.
- The `--pure-lockfile` flag ensures that Yarn uses the exact versions specified in `yarn.lock` without updating it, ensuring consistent dependency installation.

### 10. `CMD ["yarn", "deploy"]`

- Specifies the command to run when the container starts.
- Executes `yarn deploy`, which is assumed to be a script defined in `package.json` (e.g., to start the application server).
- The command is provided in exec form (`["yarn", "deploy"]`) to ensure proper signal handling (e.g., for graceful shutdown).

## Usage Instructions

1. **Ensure Docker is installed** :

- Install Docker on your system if not already present.

1. **Create a `.env` file** :

- Ensure the `.env` file in the project root contains necessary environment variables, such as:

  ```
  DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
  ```

  This is required for the application to connect to the database.

1. **Build the Docker image** :

```bash
   docker build -t boiler-api --build-arg NODE_ENV=production .
```

- The `-t boiler-api` tags the image as `boiler-api`.
- The `--build-arg NODE_ENV=production` sets the `NODE_ENV` to `production` (or another value like `development` as needed).
- The `.` specifies the build context as the current directory.

1. **Run the container** :

```bash
   docker run -p 3000:3000 boiler-api
```

- Maps port 3000 on the host to port 3000 in the container.
- Alternatively, use `docker-compose` (as described in the `docker-compose.yml` documentation) to manage the container alongside the PostgreSQL service.

1. **Verify the application** :

- Access the API at `http://localhost:3000` (or the port specified in your setup).

## Notes

- Ensure the `package.json` includes a `deploy` script (e.g., `"deploy": "node src/index.js"` or similar) to start the application.
- The `.env` file should be properly configured with the database connection details to match the PostgreSQL service setup in `docker-compose.yml`.
- The use of `node:16-alpine3.14` keeps the image lightweight, but ensure compatibility with your application’s dependencies.
- If additional build steps (e.g., TypeScript compilation) are required, they should be included in the `Dockerfile` or handled in the `deploy` script.
- For production, consider adding multi-stage builds or additional optimizations to further reduce the image size.

This `Dockerfile` provides a straightforward setup for containerizing the Express-Prisma-TypeScript-Boilerplate application, ensuring consistency across development and production environments.
