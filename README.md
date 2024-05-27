# renti-test

## Unofficial

### 数据库本地和 docker 环境下位置指向问题

#### `environment` & `env_file`

```yml
# docker-compose.yml
env_file:
  - .env
environment:
  DATABASE_URL: postgres://postgres:postgres@db:5432/postgres
  DB_HOST: db
  DB_PORT: 5432
  DB_USER: postgres
  DB_PASSWORD: postgres
  DB_NAME: postgres
```

```sh
# .env
SALT_ROUNDS=10

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DATABASE_URL=postgres://postgres:postgres@db:5432/postgres
```

In Docker Compose, the `environment` settings have higher priority over `env_file` settings. This means that if you define the same environment variable in both `environment` and `env_file`, the value specified in `environment` will override the value from `env_file`.

但 `environment` 因为是明文，显然不适合存放敏感信息，因此上例中只是存放了 DB 的一些非敏感信息，而敏感信息则还是从 `.env` 文件中读取比较靠谱儿。

`env_file` 貌似即便不在 `docker-compose.yml` 中指定，container 也会默认读取 `.env` 文件。

另外一个需要注意的坑就是 `DB_HOST`。`.env` 是我们从本地开发环境带到 docker 里来的，在本地运行 server 的环境中，本地 server 可以通过 `localhost` 访问任何挂在本地环境下的服务，如本地安装的 DB （直接挂在本地环境的端口上）或 docker 上跑的 DB（通过 docker 端口映射到本地环境的端口上）。但如果在 docker 上跑 server，docker 里的 server 的 `localhost` 和同样在 docker 里的 DB 的 `localhost` 不是一码事，而我们在 docker 里做的映射都是映射到本地环境下的，而不是 docker 之间 container 环境的映射。因此，docker 里的 server 需要通过 docker 的网络来访问 docker 里的 DB，因此 `DB_HOST` 应该是 docker 里的 DB 的服务名，而不是 `localhost`。

上面 docker-compose 例子中的 `db` 就是 docker 里的 DB 的服务名。而在 `.env` 中，`DB_HOST` 为 `localhost`。这样就可以做到无缝衔接了。

#### Knex 设置

主要就是 `knexfile.js` 中的 `connection` 配置。

```js
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'postgres',
    },
    // ...
  },
  production: {
    // ...
  },
}
```

也是设置成这种跟着环境变量走的就行。另外这个设置其实也会用在创建 knex 实例的时候，如：

```js
const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'postgres',
  },
}

export const db = knex(config)
```

我这里又写了一遍，但理想的情况是引用 knexfile 的设置。
