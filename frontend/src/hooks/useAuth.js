import { useState, useEffect } from 'react'
import api from '../utils/api'

const API = import.meta.env.VITE_API_URL;

export default function useAuth(){
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const tok = localStorage.getItem('accessToken');
    if(tok) setUser({});
  },[]);

  const signin = async (email, password) => {
    const res = await api.post('/api/auth/signin', { email, password });
    const json = res.data;
    if(res.status === 200){
      localStorage.setItem('accessToken', json.accessToken);
      localStorage.setItem('refreshToken', json.refreshToken);
      setUser({});
      return true;
    }
    throw new Error(json.error || 'Sign in failed');
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/api/auth/signup', { name, email, password });
    if(res.status === 201) return true;
    throw new Error(res.data.error || 'Sign up failed');
  };

  const signout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try{ await api.post('/api/auth/logout', { refreshToken }); }catch(e){}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/signin';
  };

  return { user, signin, signup, signout };
}
