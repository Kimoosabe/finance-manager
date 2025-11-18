import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Relatorios from './pages/Relatorios'
import Editar from './pages/Editar'   // <-- NOVO IMPORT

function VersesFooter(){
  const verses = [
    "Salmos 23:1 - O Senhor é o meu pastor; nada me faltará.",
    "Filipenses 4:13 - Posso todas as coisas naquele que me fortalece.",
    "Jeremias 29:11 - Eu sei os planos que tenho para vós...",
    "Provérbios 3:5 - Confia no Senhor de todo o teu coração.",
    "Mateus 6:33 - Buscai primeiro o Reino de Deus...",
    "Romanos 8:28 - Todas as coisas contribuem para o bem...",
    "Isaías 41:10 - Não temas, porque eu sou contigo.",
    "Salmos 46:1 - Deus é nosso refúgio e fortaleza.",
    "João 3:16 - Porque Deus amou o mundo de tal maneira...",
    "1 Coríntios 13:4 - O amor é paciente, o amor é bondoso."
  ]

  const STORAGE_KEY = 'fm_verse_data'
  const SIX_HOURS = 6 * 60 * 60 * 1000

  const [verse, setVerse] = useState('')

  useEffect(() => {
    function pickVerse(){
      const now = Date.now()
      const raw = localStorage.getItem(STORAGE_KEY)
      if(raw){
        try{
          const obj = JSON.parse(raw)
          if(obj.ts && (now - obj.ts) < SIX_HOURS){
            setVerse(verses[obj.index % verses.length])
            return
          }
        }catch(e){}
      }
      const index = Math.floor(Math.random() * verses.length)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, ts: now }))
      setVerse(verses[index])
    }
    pickVerse()
    const id = setInterval(pickVerse, SIX_HOURS)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="app-footer-fixed">
      <div className="footer-glass">
        <div>Desenvolvido por Cesar Soluções em Tecnologia</div>
        <div style={{marginTop:6, fontStyle:'italic'}}>{verse}</div>
      </div>
    </footer>
  )
}

function AppRoutes(){
  const { user, loading } = useAuth()
  if(loading) return <div className="container" style={{position:"relative", zIndex:10}}>Carregando...</div>
  if(!user) return <Login />

  const pathname = window.location.pathname

  if(pathname.startsWith('/cadastro')) return <Cadastro />
  if(pathname.startsWith('/relatorios')) return <Relatorios />
  if(pathname.startsWith('/editar')) return <Editar />   // <-- NOVA ROTA
  return <Dashboard />
}

export default function App(){
  return (
    <AuthProvider>
      <div className="liquid-bg"></div>
      <div className="liquid-overlay"></div>

      <div className="container" style={{position:"relative", zIndex:10}}>
        <AppRoutes />
      </div>

      {/*
        🚨 ESPAÇADOR ADICIONADO AQUI!
        Isso impede que o conteúdo fique escondido atrás do footer fixo.
      */}
      <div style={{ height: "140px" }}></div>

      <VersesFooter />
    </AuthProvider>
  )
}
