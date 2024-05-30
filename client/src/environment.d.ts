export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PORT: string
      API_DOMAIN: string
      API_SCHEME: string
    }
  }
}
