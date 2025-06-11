# Renti Test

## Installation

### Create `.env` files

There is an `.env.example` file separately under `server` and `client` folders. Please copy them and rename them to `.env`.

### Create RSA key for JWT tokens

In the root of the `server` folder, run:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
ssh-keygen -f jwtRS256.key.pub -e -m PEM > jwtRS256.key.pub.pem
```

When prompted, do not enter a passphrase. Afterwards, check that the public and private key exist:

```bash
$ ls jwt*
jwtRS256.key            jwtRS256.key.pub        jwtRS256.key.pub.pem
```

If you use Windows, check this article for creating keys: [How to Generate SSH Key in Windows 10 or 11](<https://phoenixnap.com/kb/generate-ssh-key-windows-10#:~:text=to%20download%20PuTTY.-,Generate%20SSH%20Key%20Pair%20in%20Windows%20via%20OpenSSH%20(ssh%2Dkeygen,the%20Command%20Prompt%20or%20PowerShell)>).

Note, please try NOT to use PowerShell to create keys since its default encoding is UTF-16, which is not supported by OpenSSH.

### Run the dev environment

#### Use Docker

Under the project root folder, run:

```bash
docker-compose up --build
```

It will build the images and run the containers. The server will be available at `http://localhost:3001` and the client at `http://localhost:3000`.

If something goes wrong and you want to start from the beginning, you can remove all the containers and volumes with:

```bash
docker-compose up -v
```

And then use the first command to reinstall all the services.

Reinstalling the services with volumes removed is recommended since the tables have foreign key restraints and it may cause problems when running the seed file to populate data into the db if you don't remove the volumes.

#### Not use Docker

- You need a postgres database running on your machine. Just download the app from the official website and install it with the default settings. Just remember when it asks for a username and a password, use `postgres` as both.

- Go to the server folder and run:

  ```bash
  nom install
  npm run dev

  # to create the tables
  npm run migration:run

  # to populate the tables
  npm run seed:run
  ```

- Go to the client folder and run:

  ```bash
  npm install
  npm start
  ```

### Use The App

- Go to `http://localhost:3000` and you will see the login page.

- You can choose light and dark mode. It also supports responsive design.

- Use any of the following user/password pairs to login:

  ```text
  username: booklover1
  password: hashedpassword1

  username: literaturefan
  password: hashedpassword2

  username: novelenthusiast
  password: hashedpassword3
  ```

- Only the library and my list pages are functional. The rest of the pages are placeholders.

  The library page will get all the books from the db. If the book is added by the current user, you can see its action button is remove from list, and the status menu at the top right conner will show up. Otherwise, the action will be add to list and the reading menu will be hidden. Unfortunately, adding to or removing from the list won't trigger any server requests. This part hasn't been implemented yet.

  The my list page will only show the books that the current user has added to the list.

- You can click user logo to bring up the user menu. You can log out from there.

- The login will keep 10 mins. After that, you will be logged out automatically.

- The clubs and user pages are placeholders.

### API

At the root of the server folder, there is a `renti.postman_collection.json` file. You can import it into Postman to test the API.

Please use the login endpoint (Accounts -> Login) to get the token. The token will be automatically save in the postman environment and will be used in the following requests. Otherwise, all the requests will return the `403 Forbidden` error.

### Tests

Tests are only available for the server side. Go to the `server` folder and run:

```bash
npm run test
```

There are only two tests, both for the login, one success and one fail.
