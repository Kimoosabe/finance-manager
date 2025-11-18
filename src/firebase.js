import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCwscnftoKjpLtfc-O9FSOFi3MRB_ZCJv0",
  authDomain: "gerenciamento-financeiro-6d51a.firebaseapp.com",
  projectId: "gerenciamento-financeiro-6d51a",
  storageBucket: "gerenciamento-financeiro-6d51a.firebasestorage.app",
  messagingSenderId: "565336292634",
  appId: "1:565336292634:web:151bd343262188bb66c0a3",
  measurementId: "G-PGWF8GP1K7"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics (apenas em produção)
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export { analytics }
