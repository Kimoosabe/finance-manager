import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

export default function ChartPro() {
  const [data, setData] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    const snap = await getDocs(
      collection(db, "users", user.uid, "transactions")
    );

    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const map = {};

    list.forEach((item) => {
      if (!item.date) return;

      const raw = new Date(item.date + "T00:00:00");

      if (isNaN(raw.getTime())) return;

      const day = raw.getDate().toString().padStart(2, "0"); // 👈 Exibe 01, 02, 03...

      if (!map[day]) {
        map[day] = {
          name: day,
          entrada: 0,
          saida: 0,
          investimento: 0,
        };
      }

      const value = Number(item.value || 0);

      if (item.type === "entrada") map[day].entrada += value;
      if (item.type === "saida") map[day].saida += value;
      if (item.type === "investimento") map[day].investimento += value;
    });

    // Ordenar pelos dias corretamente
    const sorted = Object.values(map).sort((a, b) => Number(a.name) - Number(b.name));

    setData(sorted);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-xl mb-4 font-semibold text-white">
        Movimentação Diária por Categoria
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>

            {/* GRADIENTES */}
            <defs>
              {/* Entrada (verde neon) */}
              <linearGradient id="gradEntrada" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00ff95" stopOpacity={1} />
                <stop offset="100%" stopColor="#00c274" stopOpacity={1} />
              </linearGradient>

              {/* Saída (vermelho premium) */}
              <linearGradient id="gradSaida" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff3b3b" stopOpacity={1} />
                <stop offset="100%" stopColor="#ff6565" stopOpacity={1} />
              </linearGradient>

              {/* Investimento (azul premium) */}
              <linearGradient id="gradInv" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
              </linearGradient>
            </defs>

            {/* GRID */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            {/* EIXO X (DIAS CURTOS) */}
            <XAxis
              dataKey="name"
              tick={{ fill: "white" }}
              axisLine={false}
              tickLine={false}
            />

            {/* EIXO Y */}
            <YAxis
              tick={{ fill: "white" }}
              axisLine={false}
              tickLine={false}
            />

            {/* TOOLTIP GLASS */}
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "white",
              }}
              formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
              labelFormatter={(label) => `Dia ${label}`}
            />

            {/* LINHA ENTRADA */}
            <Line
              type="monotone"
              dataKey="entrada"
              name="Entradas"
              stroke="url(#gradEntrada)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#00ff95" }}
              activeDot={{ r: 7 }}
            />

            {/* LINHA SAÍDA */}
            <Line
              type="monotone"
              dataKey="saida"
              name="Saídas"
              stroke="url(#gradSaida)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ff3b3b" }}
              activeDot={{ r: 7 }}
            />

            {/* LINHA INVESTIMENTO (AZUL) */}
            <Line
              type="monotone"
              dataKey="investimento"
              name="Investimentos"
              stroke="url(#gradInv)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 7 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
