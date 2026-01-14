import React, { createContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ // try to refresh on mount
    let mounted = true
    const tryRefresh = async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if(!refreshToken){ if(mounted) { setLoading(false); setUser(null); } return }
      try{
        const res = await api.post('/api/auth/refresh', { refreshToken })
        const newAccess = res.data.accessToken
        localStorage.setItem('accessToken', newAccess)
        if(mounted) setUser({})
      }catch(e){ localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); if(mounted) setUser(null) }
      finally{ if(mounted) setLoading(false) }
    }
    tryRefresh()
    return ()=>{ mounted = false }
  },[])

  const signin = async (email, password) => {
    const res = await api.post('/api/auth/signin', { email, password })
    const json = res.data
    localStorage.setItem('accessToken', json.accessToken)
    localStorage.setItem('refreshToken', json.refreshToken)
    setUser({})
    return true
  }

  const signup = async (name, email, password) => {
    const res = await api.post('/api/auth/signup', { name, email, password })
    return res.status === 201
  }

  const signout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try{ await api.post('/api/auth/logout', { refreshToken }) }catch(e){}
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    window.location.href = '/signin'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  )
}
