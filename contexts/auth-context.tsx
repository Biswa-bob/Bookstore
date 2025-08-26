"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"
import { type User, type AuthTokens, type AuthState, authAPI, tokenStorage } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; tokens: AuthTokens } }
  | { type: "SET_TOKENS"; payload: AuthTokens }
  | { type: "CLEAR_AUTH" }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
      }
    case "SET_TOKENS":
      return { ...state, tokens: action.payload }
    case "CLEAR_AUTH":
      return { user: null, tokens: null, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    tokens: null,
    isLoading: true,
  })

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      const storedTokens = tokenStorage.getTokens()
      if (storedTokens) {
        try {
          // In a real app, validate the token and get user info
          // For now, we'll simulate this
          const mockUser: User = {
            id: "1",
            email: "user@example.com",
            role: "user",
            name: "User",
          }
          dispatch({ type: "SET_USER", payload: { user: mockUser, tokens: storedTokens } })
        } catch (error) {
          tokenStorage.clearTokens()
          dispatch({ type: "CLEAR_AUTH" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const { user, tokens } = await authAPI.login(email, password)
      tokenStorage.setTokens(tokens)
      dispatch({ type: "SET_USER", payload: { user, tokens } })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const { user, tokens } = await authAPI.register(email, password, name)
      tokenStorage.setTokens(tokens)
      dispatch({ type: "SET_USER", payload: { user, tokens } })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } finally {
      tokenStorage.clearTokens()
      dispatch({ type: "CLEAR_AUTH" })
    }
  }

  const refreshTokens = async () => {
    if (!state.tokens?.refreshToken) return

    try {
      const newTokens = await authAPI.refreshToken(state.tokens.refreshToken)
      tokenStorage.setTokens(newTokens)
      dispatch({ type: "SET_TOKENS", payload: newTokens })
    } catch (error) {
      await logout()
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshTokens,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
