export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_PORT: string
      REACT_APP_API_DOMAIN: string
      REACT_APP_API_SCHEME: string
    }
  }
}
