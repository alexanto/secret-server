# secret-server

Simple app to view and store secrets using Express + Vue.js
Database is hosted on MongoDB Atlas

Prerequisites:

* Node with npm
* Docker with docker compose

Running the application:

1. Run using docker-compose:

Create a `.env` file with the following content:

```
PORT=8081
MONGO_USER="secret-server"
MONGO_PWD="secret-server"
DB_NAME="secrets"
ENCRYPT_KEY="19629fd68202d34dcb79c66de2477eb6"
```

From the project root folder, run:

```
docker-compose --env-file .env build
docker-compose --env-file .env up
```

Note: Obviously, secrets should NOT be in the readme, I am only including them here, because I had to share them somehow, this is only a test project and I am going to delete the db later.

2. Run on your local machine without docker:

From the project root run:

```
cd secret-client
npm i
npm run serve
cd ..
cd server
npm i
npm start
```

The application frontend can be viewed at: http://localhost:8080/

Some examples already in the db:

```
# valid:
Secret Text: mypassword
Hash: 024967b415f922960524066af0619f91db9ea33f

# never expires:
Secret Text: hello
Hash: 9d534c2e940824cf468dd008653054be80dbaf90

# already expired:
Secret Text: 1234
Hash: 022a2ef378324b9a68601b138a81fbedaa9c6f55
Secret expires at: 2021 02 12 09:40:02

# maximum views exhaused
Secret Text: secret
Hash: e8bb286345b3d205b396dcd630dd12116ea6e2ef
```

You can run the unit tests for the server with:
```
cd server
npm run test
```



