import { createContext as reactCreateContext, useContext } from 'react'

export default function createContext<A>() {
  const ctx = reactCreateContext<A | undefined>(undefined)

  function useCtx() {
    const c = useContext(ctx)
    if (c === undefined)
      throw new Error(
        `Component must be inside the context provider with a value`
      )
    return c
  }
  return [useCtx, ctx] as const
}
