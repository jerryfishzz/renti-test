export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SALT_ROUNDS: string
      SERVER_PORT: string
      JWT_PRIVATE_KEY_PATH: string
      JWT_PRIVATE_KEY_MATERIAL: string
    }
  }
}
