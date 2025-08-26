export interface User {
  id: string
  email: string
  role: "user" | "admin"
  name: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
}

// Mock API functions - replace with actual API calls
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response - replace with actual API
    const mockUser: User = {
      id: "1",
      email,
      role: email.includes("admin") ? "admin" : "user",
      name: email.split("@")[0],
    }

    const mockTokens: AuthTokens = {
      accessToken: "mock-access-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
    }

    return { user: mockUser, tokens: mockTokens }
  },

  async register(email: string, password: string, name: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Date.now().toString(),
      email,
      role: "user",
      name,
    }

    const mockTokens: AuthTokens = {
      accessToken: "mock-access-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
    }

    return { user: mockUser, tokens: mockTokens }
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      accessToken: "new-access-token-" + Date.now(),
      refreshToken: "new-refresh-token-" + Date.now(),
    }
  },

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
}

// Token storage utilities
export const tokenStorage = {
  getTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null

    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    if (!accessToken || !refreshToken) return null

    return { accessToken, refreshToken }
  },

  setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return

    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("refreshToken", tokens.refreshToken)
  },

  clearTokens(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  },
}
