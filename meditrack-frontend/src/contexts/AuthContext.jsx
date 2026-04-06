import React, { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import { syncService } from '../services/syncService'
import { toast } from '../utils/toast'

const AuthContext = createContext()

const googleClientId = '1052240755199-mf2k20ah0dtv9vdmav9629apensh763j.apps.googleusercontent.com'
const googleConfigured = true

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('meditrack_token'))
  const [isGuest, setIsGuest] = useState(localStorage.getItem('meditrack_guest') === 'true')
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('meditrack_token')
      if (!storedToken) {
        setIsGuest(localStorage.getItem('meditrack_guest') === 'true')
        setIsLoading(false)
        setIsReady(true)
        return
      }

      try {
        const res = await axiosInstance.get('/auth/me')
        setUser(res.data)
        setToken(storedToken)
        setIsGuest(false)
      } catch {
        localStorage.removeItem('meditrack_token')
        setToken(null)
        setIsGuest(localStorage.getItem('meditrack_guest') === 'true')
      } finally {
        setIsLoading(false)
        setIsReady(true)
      }
    }

    initAuth()
  }, [])

  const enterGuestMode = () => {
    localStorage.removeItem('meditrack_token')
    localStorage.setItem('meditrack_guest', 'true')
    setIsGuest(true)
    setUser(null)
    setToken(null)
  }

  const login = async (credential) => {
    const wasGuest = isGuest
    try {
      const res = await axiosInstance.post('/auth/google', { credential })
      const { token: newToken, user: newUser } = res.data

      localStorage.setItem('meditrack_token', newToken)
      localStorage.removeItem('meditrack_guest')

      setToken(newToken)
      setUser(newUser)
      setIsGuest(false)

      if (wasGuest) {
        try {
          const syncResult = await syncService.syncGuestDataToServer(newToken)
          if (syncResult.failCount > 0) {
            toast.info(
              `Signed in. Synced ${syncResult.successCount} items, ${syncResult.failCount} failed.`,
            )
          } else if (syncResult.successCount > 0) {
            toast.success(`Signed in and synced ${syncResult.successCount} guest records.`)
          } else {
            toast.success('Signed in successfully.')
          }
        } catch {
          toast.info('Signed in, but guest data sync was partial.')
        }
      } else {
        toast.success('Signed in successfully.')
      }

      return true
    } catch (err) {
      console.error('Login failed', err)
      toast.danger('Sign in failed. Please try again.')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('meditrack_token')
    localStorage.removeItem('meditrack_guest')
    setToken(null)
    setUser(null)
    setIsGuest(false)
    toast.info('Signed out.')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isReady,
        isAuthenticated: !!user,
        isGuest,
        googleConfigured,
        enterGuestMode,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
