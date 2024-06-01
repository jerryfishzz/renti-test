export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SALT_ROUNDS: string
      JWT_PRIVATE_KEY_PATH: string
      JWT_PRIVATE_KEY_MATERIAL: string
      API_PORT: string
      API_USER: string
      API_PASS: string
    }
  }
}
