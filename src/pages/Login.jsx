import React, { useState } from 'react'
import { auth, googleProvider } from '../firebase'
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth'

export default function Login() {

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  async function handleGoogle(){
    try {
      await signInWithPopup(auth, googleProvider)
      window.location.href = '/'
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSubmit(e){
    e.preventDefault()
    try {
      if(isRegister){
        await createUserWithEmailAndPassword(auth, email, pass)
      } else {
        await signInWithEmailAndPassword(auth, email, pass)
      }
      window.location.href = '/'
    } catch(err){
      alert(err.message)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="glass p-8 max-w-md w-full">
        
        <h2 className="text-2xl font-bold mb-4">Gerenciamento Financeiro</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Campos */}
          <input 
            className="input-glass"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input 
            className="input-glass"
            placeholder="Senha"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />

          {/* BOTÕES AJUSTADOS */}
          <div className="flex gap-2">

            {/* Entrar */}
            <button 
              className="btn-login-small w-1/2"
              type="submit"
            >
              {isRegister ? 'Registrar' : 'Entrar'}
            </button>

            {/* Google */}
            <button
              type="button"
              className="btn-google-small w-1/2"
              onClick={handleGoogle}
            >
              Entrar com Google
            </button>

          </div>

          {/* Alternar login/register */}
          <div>
            <button 
              type="button" 
              className="text-sm underline"
              onClick={() => setIsRegister(s => !s)}
            >
              {isRegister ? 'Já tem conta? Entrar' : 'Criar conta'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
