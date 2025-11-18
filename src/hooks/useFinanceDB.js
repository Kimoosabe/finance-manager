import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect, useState } from 'react'

export function useTransactions(uid){
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    if(!uid) return
    const q = query(collection(db, 'users', uid, 'transactions'))
    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [uid])
  return [transactions]
}

export async function addTransaction(uid, payload){
  return await addDoc(collection(db, 'users', uid, 'transactions'), { ...payload, createdAt: serverTimestamp() })
}

export async function addCategory(uid, name){
  return await addDoc(collection(db, 'users', uid, 'categories'), { name, createdAt: serverTimestamp() })
}


export async function editCategory(uid, id, name){
  const ref = doc(db, 'users', uid, 'categories', id)
  return await updateDoc(ref, { name })
}
