import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../hooks/useFinanceDB'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { motion } from 'framer-motion'
import ChartPro from "../components/ChartPro"
import { formatBRL } from "../utils/formatBRL"

export default function Dashboard(){
  const { user } = useAuth()
  const [transactions] = useTransactions(user?.uid)

  const totals = { entrada:0, saida:0, investimento:0 }

  transactions.forEach(t => {
    const v = Number(t.value) || 0
    if(t.type === 'entrada') totals.entrada += v
    if(t.type === 'saida') totals.saida += v
    if(t.type === 'investimento') totals.investimento += v
  })

  const totalGeral = totals.entrada - totals.saida + totals.investimento

  return (
    <div>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-4xl font-extrabold">Gerenciamento Financeiro</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            className="btn-red-animated w-full sm:w-auto"
            onClick={() => window.location.href = '/cadastro'}
          >
            Novo Lançamento
          </button>

          <button
            className="btn-red-animated w-full sm:w-auto"
            onClick={() => window.location.href = '/relatorios'}
          >
            Relatórios
          </button>

          <button
            className="btn-red-animated w-full sm:w-auto"
            onClick={() => { signOut(auth); window.location.href = '/' }}
          >
            Sair
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >

        <div className="glass p-6 rounded-xl">
          <h3 className="text-sm text-white/70">Entradas</h3>
          <p className="text-2xl font-semibold text-green-400">
            R$ {formatBRL(totals.entrada)}
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-sm text-white/70">Saídas</h3>
          <p className="text-2xl font-semibold text-red-400">
            R$ {formatBRL(totals.saida)}
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-sm text-white/70">Investimentos</h3>
          <p className="text-2xl font-semibold text-pink-400">
            R$ {formatBRL(totals.investimento)}
          </p>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass p-6 mt-6 rounded-xl"
      >
        <h3 className="text-lg text-white/70 mb-1">Saldo Final</h3>
        <p className={`text-3xl font-bold ${totalGeral >= 0 ? "text-green-300" : "text-red-400"}`}>
          R$ {formatBRL(totalGeral)}
        </p>
      </motion.div>

      <div className="mt-10">
        <ChartPro />
      </div>

    </div>
  )
}
