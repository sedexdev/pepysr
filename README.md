```
!=== Archive Status ===!

This project has been archived and will receive no further updates beyond
those I have included recently to get the project actually running and
documented. There is no guarantee the steps below will work in future.

The use of 'NODE_OPTIONS=--openssl-legacy-provider' is to get the app running
only. This is insecure and not suitable for anything beyond test/dev.

From pepysr/package.json:

"scripts": {
    ...,
    "dev": "NODE_OPTIONS=--openssl-legacy-provider ...",
    ...
},
```

# 📘 pepysr

PepysR is a diary application that will store everything you need to remember. If it's important, or even if it's not, jot it down in the application and feel confident that you'll never loose your schedule, your appointments or your life story.

Pepysr was a **\_3rd year coursework assignment** built on the MERN technology stack.

Tooling:

-   The React library (built using create-react-app) for scalability and component management
-   ExpressJS to run a backend server offering a REST API
-   NodeJS and npm for backend services and package dependencies
-   NoSQL user / session database on MongoDB
-   Schema-based application data modelling solution using Mongoose
-   Jest and Enzyme testing frameworks for unit, integration, and component testing

## ✨ Features

-   ✅ Secure registration and login
-   ✅ Date search
-   ✅ Daily note taking

## 📦 Installation

### Prerequisites

```bash
Node.js >= 17
npm
Docker
Docker Compose
```

### Local Setup

Get the code:

```bash
# Clone the repository
git clone https://github.com/sedexdev/pepysr.git
cd pepysr
```

Install dependencies:

```bash
# From the root - pepysr/
npm install

# From pepysr/view
npm install

# From pepysr/model
npm install

# After each you may consider running audit for some extra security
npm audit fix
```

## ⚙️ Configuration

Create a directory called `config` in the project root then create a file called `default.json` and add the following:

```json
{
    "database": {
        "mongoDBPassword": "YOUR_MONGO_PASSWORD"
    },
    "encryption": {
        "entryKey": "A_SUITABLE_ENCRYPTION_KEY"
    },
    "tokens": {
        "jwtCode": "A_SUITABLE_SECRET_KEY_FOR_SIGNING_A_JWT"
    },
    "session": {
        "sessionName": "YOUR_CHOSEN_SESSION_NAME",
        "sessionLife": 43200000,
        "sessionKey": "A_SUITABLE_SESSION_KEY"
    }
}
```

> MongoDB instance credentials

Create a MongoDB ENV file in the root - `.env.mongo-data` - and add the following:

```env
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=YOUR_MONGO_PASSWORD
MONGO_INITDB_DATABASE=pepsyrdb
```

Finally, create a directory called `mongo-data` in the root for the Docker Compose volumes:

```bash
mkdir mongo-data
```

> MongoDB containers

```bash
# Start the containers
sudo docker compose up -d

# Stop the containers
sudo docker compose down

# Stop the containers and destroy database
sudo docker compose down -v
```

> Inspect the MongoDB database from mongosh

```bash
sudo docker container exec -it mongodb-data mongosh "mongodb://admin:YOUR_MONGO_PASSWORD@localhost:27017/pepysrdb?authSource=admin"
```

### Run the development server

After following the **_Configuration_** steps above run:

```bash
npm run dev
```

This starts the dev server & opens the client in your default browser.

## 📂 Project Structure

```
pepysr/
│
├── model/                  # Database connection & schemas
├── routes/                 # API backend
├── utils/                  # Session utility functions
├── view/                   # React frontend
├── .gitignore              # Git ignore file
├── docker-compose.yml      # MOngoDB container config
├── package.json            # Root level dependencies
├── README.md               # This README.md file
└── server.js               # Express server configuration
```

## 🧪 Running Tests

```bash
# npm test scripts exist in the following directories
pepysr/
pepysr/model
pepysr/view

# To run the tests use
npm run test
```

**_Disclaimer_**: As this project has been archived there has been no work done to ensure tests pass since updating this repos documentation.

## 🧑‍💻 Authors

-   **Andrew Macmillan** – [@sedexdev](https://github.com/sedexdev)
