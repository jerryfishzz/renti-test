export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SALT_ROUNDS: string
      SERVER_PORT: string
    }
  }
}
