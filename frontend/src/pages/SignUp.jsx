import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

export default function SignUp(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    if(!name || !email || !password){ setError('All fields are required'); return; }
    try{
      await signup(name, email, password);
      navigate('/signin');
    }catch(err){ setError(err.message || 'Signup failed'); }
  };

  return (
    <form className="max-w-md" onSubmit={handle}>
      <h2 className="text-2xl font-semibold">Sign Up</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input className="mt-4 w-full p-2 border rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="mt-4 w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="mt-2 w-full p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Create account</button>
    </form>
  )
}
