import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";
import { formatBRL } from "../utils/formatBRL";

export default function Relatorios() {
  const { user } = useAuth();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [filteredList, setFilteredList] = useState([]);

  const [summary, setSummary] = useState({
    count: 0,
    total: 0,
    entrada: 0,
    saida: 0,
    investimento: 0,
  });

  // --- FORMATADOR DE DATAS CORRIGIDO ---
  function formatDateFixed(dateValue) {
    if (!dateValue) return "-";

    if (dateValue.seconds) {
      const d = new Date(dateValue.seconds * 1000);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
      return d.toLocaleDateString();
    }

    const d = new Date(dateValue + "T00:00:00");
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString();
  }

  // EXCLUIR ITEM
  async function deleteItem(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este lançamento?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "users", user.uid, "transactions", id));

    alert("Item excluído!");
    load();
  }

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  async function load() {
    if (!user) return;

    const snap = await getDocs(query(collection(db, "users", user.uid, "transactions")));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    setItems(data);
    computeSummary(data);
  }

  async function loadCategories() {
    if (!user) return;

    const snap = await getDocs(collection(db, "users", user.uid, "categories"));
    const map = {};

    snap.docs.forEach((d) => (map[d.id] = d.data().name));
    setCategoriesMap(map);
  }

  function computeSummary(list) {
    const filtered = list.filter((i) => {
      const fix = formatDateFixed(i.date);
      const date = new Date(fix.split("/").reverse().join("-"));

      if (start && date < new Date(start)) return false;
      if (end && date > new Date(end)) return false;
      if (typeFilter !== "all" && i.type !== typeFilter) return false;

      return true;
    });

    const soma = filtered.reduce((s, i) => s + Number(i.value || 0), 0);

    setSummary({
      count: filtered.length,
      total: soma,
      entrada: filtered.filter((i) => i.type === "entrada").length,
      saida: filtered.filter((i) => i.type === "saida").length,
      investimento: filtered.filter((i) => i.type === "investimento").length,
    });

    setFilteredList(filtered);
  }

  function applyFilters() {
    computeSummary(items);
  }

  // PDF
  function exportPDF() {
    const docPDF = new jsPDF();

    const rowsSource = filteredList.length > 0 ? filteredList : items || [];

    const rows = rowsSource.map((i) => [
      i.title || "",
      i.type || "",
      "R$ " + formatBRL(i.value || 0),
      categoriesMap[i.categoryId] || "-",
      formatDateFixed(i.date),
    ]);

    autoTable(docPDF, {
      head: [["Título", "Tipo", "Valor", "Categoria", "Data"]],
      body: rows,
      startY: 36,
    });

    docPDF.save("relatorio.pdf");
  }

  return (
    <div className="min-h-[70vh] flex flex-col gap-6 pb-40">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left flex-1">Relatórios</h1>
        <button onClick={() => window.history.back()} className="btn-red-animated w-full sm:w-auto">
          Voltar
        </button>
      </div>

      {/* FILTROS */}
      <div className="glass p-4 sm:p-6 relative mb-6">
        <div className="flex flex-col gap-3">
          {/* Datas em linha em mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/70 mb-1 block">Data Início</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="input-glass w-full" />
            </div>
            <div>
              <label className="text-xs text-white/70 mb-1 block">Data Fim</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="input-glass w-full" />
            </div>
          </div>

          {/* Select de tipo */}
          <div>
            <label className="text-xs text-white/70 mb-1 block">Tipo</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-glass w-full">
              <option value="all">Todos</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
              <option value="investimento">Investimentos</option>
            </select>
          </div>

          {/* Botões */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <button className="btn-pill w-full" onClick={applyFilters}>
              Aplicar Filtros
            </button>
            <button className="btn-pill w-full" onClick={exportPDF}>
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* RESUMO */}
      <motion.div className="p-6 glass" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h3 className="mb-3">Movimentações</h3>

        <p>
          Total de movimentações: <strong>{summary.count}</strong>
        </p>

        <p>
          Valor total: <strong>R$ {formatBRL(summary.total)}</strong>
        </p>

        <p>
          Entradas: {summary.entrada} — Saídas: {summary.saida} — Investimentos: {summary.investimento}
        </p>
      </motion.div>

      {/* TABELA */}
      <div className="mt-6 p-6 glass">
        <h3 className="mb-3">Movimentações</h3>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-white/80">
                <th className="p-2">Título</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Categoria</th>
                <th className="p-2">Data</th>
                <th className="p-2 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((it) => (
                <tr key={it.id} className="border-t border-white/6">
                  <td className="p-2">{it.title}</td>
                  <td className="p-2">{it.type}</td>
                  <td className="p-2">R$ {formatBRL(it.value)}</td>
                  <td className="p-2">{categoriesMap[it.categoryId] || "-"}</td>
                  <td className="p-2">{formatDateFixed(it.date)}</td>

                  <td className="p-2">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button className="btn-pill text-xs px-3 py-1 w-full sm:w-auto" onClick={() => (window.location.href = `/editar/${it.id}`)}>
                        Editar
                      </button>
                      <button className="btn-red-animated text-xs px-3 py-1 w-full sm:w-auto" onClick={() => deleteItem(it.id)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
