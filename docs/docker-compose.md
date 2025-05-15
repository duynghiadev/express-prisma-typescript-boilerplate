# Docker Compose Configuration Explanation

This document explains the `docker-compose.yml` file used to set up a PostgreSQL database and an API service for the project. The configuration defines two services: `postgres` for the database and `api` for the application server.

## File Structure

The `docker-compose.yml` file orchestrates the setup of a PostgreSQL database and the API application using Docker containers. It specifies the environment, ports, dependencies, and build instructions.

## Configuration Breakdown

### Services

#### 1. `postgres` Service

This service sets up a PostgreSQL database container.

- **Image** : `postgres`
- Uses the official PostgreSQL Docker image from Docker Hub.
- **Container Name** : `postgres_db_container`
- Assigns a specific name to the container for easy identification.
- **Environment Variables** :
- `POSTGRES_DB=${POSTGRES_DB:-postgres}`: Sets the database name. Defaults to `postgres` if not specified in the `.env` file.
- `POSTGRES_USER=${POSTGRES_USER:-postgres}`: Sets the database user. Defaults to `postgres` if not specified.
- `POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password1}`: Sets the database password. Defaults to `password1` if not specified.
- **Ports** : `"5432:5432"`
- Maps port 5432 on the host to port 5432 in the container, allowing external access to the PostgreSQL database.
- **Restart** : `unless-stopped`
- Ensures the container restarts automatically unless explicitly stopped.

#### 2. `api` Service

This service sets up the API application container.

- **Container Name** : `boiler_api_container`
- Assigns a specific name to the API container for clarity.
- **Build** : `.`
- Builds the Docker image using the `Dockerfile` in the current directory (`.`).
- **Ports** : `"3000:3000"`
- Maps port 3000 on the host to port 3000 in the container, allowing access to the API.
- **Depends On** : `postgres`
- Ensures the `postgres` service starts before the `api` service, as the API likely requires the database to be running.

## Usage Instructions

1. **Ensure Docker and Docker Compose are installed** :

- Install Docker and Docker Compose on your system if not already present.

1. **Create a `.env` file (optional)** :

- Define environment variables for the PostgreSQL service, e.g.:
  ```
  POSTGRES_DB=your_db_name
  POSTGRES_USER=your_db_user
  POSTGRES_PASSWORD=your_db_password
  ```
- If not provided, the defaults (`postgres`, `postgres`, `password1`) will be used.

1. **Run Docker Compose** :

```bash
   docker-compose up -d
```

- The `-d` flag runs the containers in detached mode (in the background).
- This command builds the API image, starts the PostgreSQL container, and then starts the API container.

1. **Access the Services** :

- **PostgreSQL** : Connect to the database at `localhost:5432` using the credentials specified in the `.env` file or the defaults.
- **API** : Access the API at `http://localhost:3000`.

1. **Stop the Services** :

```bash
   docker-compose down
```

- Stops and removes the containers.

## Notes

- Ensure the `Dockerfile` in the project root is configured correctly for the `api` service.
- The `depends_on` directive ensures the database is running before the API starts, but it does not guarantee the database is fully initialized. You may need to configure the API to wait for the database connection.
- The `.env` file is optional but recommended for customizing database credentials securely.
- The `restart: unless-stopped` policy for the `postgres` service ensures the database remains available unless manually stopped.

This configuration provides a robust setup for running a PostgreSQL database and an API server without requiring a GUI application.
