import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Editar() {
  const user = auth.currentUser;

  const id = window.location.pathname.split("/editar/")[1];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) loadItem();
  }, [user, id]);

  async function loadItem() {
    try {
      setLoading(true);
      const ref = doc(db, "users", user.uid, "transactions", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Item não encontrado.");
        window.history.back();
        return;
      }

      const d = snap.data();

      // 🔥 Corrige Timestamp → string YYYY-MM-DD
      if (d.date && d.date.seconds) {
        d.date = new Date(d.date.seconds * 1000)
          .toISOString()
          .slice(0, 10);
      }

      // Se já é string, mantém
      if (typeof d.date === "string") {
        d.date = d.date.slice(0, 10);
      }

      setData(d);
    } catch (err) {
      alert("Erro ao carregar item: " + err.message);
      window.history.back();
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit() {
    try {
      setLoading(true);
      const ref = doc(db, "users", user.uid, "transactions", id);

      // 🔥 Data 100% correta
      // Sempre salva em YYYY-MM-DD para evitar UTC
      const fixedDate = data.date
        ? data.date.slice(0, 10)
        : new Date().toISOString().slice(0, 10);

      const payload = {
        ...data,
        value: Number(data.value || 0),
        date: fixedDate, // 🔥 CORREÇÃO
      };

      await updateDoc(ref, payload);

      alert("Item atualizado com sucesso!");
      window.history.back();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-[70vh] flex justify-center">
      <div className="glass p-6 max-w-2xl w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left flex-1">Editar Lançamento</h1>
          <button
            className="btn-red-animated w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>

        <input
          className="input-glass mb-3"
          placeholder="Título"
          value={data.title || ""}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        <input
          className="input-glass mb-3"
          placeholder="Valor"
          value={data.value || ""}
          onChange={(e) => setData({ ...data, value: e.target.value })}
        />

        <select
          className="input-glass mb-3"
          value={data.type || "entrada"}
          onChange={(e) => setData({ ...data, type: e.target.value })}
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="investimento">Investimento</option>
        </select>

        <input
          type="date"
          className="input-glass mb-3"
          value={data.date || ""}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />

        <textarea
          className="input-glass mb-4"
          placeholder="Observações"
          value={data.notes || ""}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />

        <div className="flex gap-2 justify-end">
          <button
            className="btn-back-small"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>

          <button className="btn-red-animated" onClick={saveEdit}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
