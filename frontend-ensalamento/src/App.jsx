import React, { useState, useEffect } from "react";
import Login from "./Login";
import axios from "axios";

const API_URL = "http://localhost:8080/salas/create";

export default function App() {
  const [salas, setSalas] = useState([]);
  const [novaSala, setNovaSala] = useState("");
  const [logado, setLogado] = useState(false);

  // Verifica se o usuário tem um token salvo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLogado(true);
  }, []);

  // Função para buscar salas
  const carregarSalas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    }
  };

  // Função para adicionar uma sala
  const adicionarSala = async () => {
    if (!novaSala) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_URL,
        { nome: novaSala },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNovaSala("");
      carregarSalas();
    } catch (error) {
      console.error("Erro ao adicionar sala", error);
    }
  };

  // Se não estiver logado, exibe a tela de login
  if (!logado) {
    return <Login onLoginSuccess={() => setLogado(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold">Sistema de Ensalamento</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          setLogado(false);
        }}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Sair
      </button>
      <div className="mt-5">
        <input
          type="text"
          placeholder="Nome da sala"
          value={novaSala}
          onChange={(e) => setNovaSala(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={adicionarSala}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Adicionar Sala
        </button>
      </div>
      <ul className="mt-5">
        {salas.map((sala) => (
          <li key={sala.id} className="border p-2 my-2 rounded">
            {sala.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
