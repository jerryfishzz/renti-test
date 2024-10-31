# Use HTTP cookie and sessions table to do login and auth

Login 是检查用户是否有权限访问资源，而 auth 是检查用户请求是否来自其本人。

Login 只会在用户第一次登录或登出后再登录 app 时发生，而 auth 发生在每次的请求中。

如果 login 失败，用户将无法正常使用 app，而 auth 失败，系统会试图检查用户的合法性。如果合法，会重新颁发用户许可 access token，用户可以继续正常使用 app；反之，请求则不会被接受。而具体是不是强制登出用户，这个取决于客户端的实现。

在本 app 中，用户登录会在 db 中生成具有实效性的 session 记录，session 的 id 会保存在客户端，如浏览器中。用户每次使用 app 时会通过 session id 从 db 中验证用户登录是否过期，如果没有过期，则不需要重新登录，这样可以减少用户的登录次数。用户许可则存储在 app 中，每次刷新或关闭 app 都会重置 token，但只要用户登录 session 有效，用户就可以继续使用 app。

App 的认证是通过 HTTP cookie 完成的。我们通过在服务器上创建 session 信息，并把 session 信息通过 response 上的 cookie 发送给前端，使前端获得 session 信息。在每次前端发送来的请求 request 中，都会在 HTTP cookie 上携带 session 信息，这样就可以通过和服务器上的 session 进行比对来完成认证了。

通过在数据库中创建 sessions table 来储存所有的用户登录请求信息，sessions 表中会存储用户 id、refresh token 和 user agent 等信息。

```txt
id  | account_id | refresh_token | created_at | updated_at | user_agent
```

- user agent 这里可以让用户在不同的设备或浏览器上登录，而不会互相影响。

- 每个 session 的 id，在创建时生成并发送给前端，这样每次前端进行请求，就可以根据这个 id 查找它的登录是否还有效。

  ```ts
  // Create in response
  function addSessionCookie(res: Response, sessionId: number, expires: Date) {
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires,
    })
  }

  // Read from request
  const cookieSessionId = req.cookies?.sessionId as undefined | number
  ```

  由上可知，创建时我们是在 response 的 `cookie` 上创建的 session 信息，创建时起的这个名 `sessionId` 是自定义的，所以我们在之后从 request 中的 `cookie` 里读取时，typescript 的提示是 any，需要我们自己断言它的类型。

- 每次成功读取 session 信息后，我们都会更新前端的 session cookie 信息，时刻保证前端的 session 和服务器上的一致。

  ```ts
  if (session) {
    try {
      const sub = verify(session.refresh_token)

      // Update session cookie
      addSessionCookie(res, session.id, new Date(sub.exp * 1000))
      isValid = true
    } catch (e) {
      console.error(e)
    }
  }
  ```

- 每次创建新的 session 时，都会检查该用户是否有过期的 session。如果有，删除。注意，过期的 session 不包括新建的 session 自己，比如在测试时。

  ```ts
  const refresh_token = createToken(account.id, refreshExp)

  const [newSession] = await db('sessions')
    .insert({
      account_id: account.id,
      refresh_token,
      user_agent: getUserAgent(req),
    })
    .returning('*')
  if (!newSession) return res.sendStatus(500)

  // Check the existing expired sessions and delete them
  await deleteExpiredSessions(account.id, newSession.id)
  ```
