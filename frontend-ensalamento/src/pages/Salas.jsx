import React, { useState, useEffect } from "react";
import Login from "./Login";
import axios from "axios";

const API_URL = "http://localhost:8080";

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [novaSala, setNovaSala] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogado(true);
      carregarSalas(token);
    }
  }, []);

  const carregarSalas = async (tokenParam) => {
    const token = tokenParam || localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/sala`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    }
  };

  const adicionarSala = async () => {
    if (!novaSala || capacidade === "") return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/sala/create`,
        {
          nome: novaSala,
          capacidade: parseInt(capacidade), // garante que seja número
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNovaSala("");
      setCapacidade("");
      carregarSalas(token);
    } catch (error) {
      console.error("Erro ao adicionar sala", error);
    }
  };

  if (!logado) {
    return (
      <Login
        onLoginSuccess={() => {
          setLogado(true);
          carregarSalas();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Ensalamento</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setLogado(false);
          setSalas([]);
        }}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>

      <div className="mt-8 flex gap-2 flex-wrap items-center justify-center">
        <input
          type="text"
          placeholder="Nome da sala"
          value={novaSala}
          onChange={(e) => setNovaSala(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <input
          type="number"
          min="0"
          placeholder="Capacidade"
          value={capacidade}
          onChange={(e) => setCapacidade(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={adicionarSala}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar Sala
        </button>
      </div>

      <ul className="mt-8 w-full max-w-2xl space-y-4">
        {salas.map((sala) => (
          <li
            key={sala.id}
            className="bg-white border rounded-lg shadow-sm p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-xl font-semibold text-gray-800">{sala.name}</p>
              <p className="text-sm text-gray-500">Capacidade: {sala.capacidade}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
