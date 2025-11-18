import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Cadastro() {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("entrada");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");

  const [categories, setCategories] = useState([]);

  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    if (user) loadCategories();
  }, [user]);

  async function loadCategories() {
    const snap = await getDocs(
      collection(db, "users", user.uid, "categories")
    );

    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCategories(list);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!title || !value || !category) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const dateToSave = date || new Date().toISOString().slice(0, 10);

    await addDoc(collection(db, "users", user.uid, "transactions"), {
      title,
      value: Number(value),
      type,
      categoryId: category,
      notes,
      date: dateToSave,
    });

    alert("Lançamento salvo!");
    window.history.back();
  }

  async function handleAddCat() {
    if (!newCatName.trim()) return;

    await addDoc(
      collection(db, "users", user.uid, "categories"),
      { name: newCatName }
    );

    setNewCatName("");
    setShowCatModal(false);
    loadCategories();
  }

  return (
    <div className="min-h-[70vh] flex justify-center">
      <div className="glass p-6 max-w-3xl w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-7 gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left flex-1">Novo Lançamento</h1>
          <button
            className="btn-red-animated w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="input-glass"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input-glass"
            placeholder="Valor"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <select
            className="input-glass"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="investimento">Investimento</option>
          </select>

          <div className="flex gap-2 items-center">
            <select
              className="input-glass flex-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn-red-animated-big"
              onClick={() => setShowCatModal(true)}
            >
              +
            </button>
          </div>

          <textarea
            className="input-glass md:col-span-2"
            placeholder="Observações (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <input
            type="date"
            className="input-glass"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn-red-animated px-6">
              Salvar
            </button>
          </div>
        </form>

        {showCatModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="glass p-6 rounded-xl w-[320px]">
              <h2 className="text-lg font-semibold mb-3">Nova Categoria</h2>

              <input
                className="input-glass w-full mb-3"
                placeholder="Nome da categoria"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="btn-red-animated"
                  onClick={() => setShowCatModal(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn-red-animated"
                  onClick={handleAddCat}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
