import React, { useState, useEffect } from "react";
import Login from "./Login";
import axios from "axios";

const API_URL = "http://localhost:8080";

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [novaSala, setNovaSala] = useState("");
  const [novaCapacidade, setNovaCapacidade] = useState("");
  const [logado, setLogado] = useState(false);
  const [editandoSala, setEditandoSala] = useState(null);

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

  const adicionarOuEditarSala = async () => {
    const token = localStorage.getItem("token");
    if (!novaSala) return;

    const payload = {
      nome: novaSala,
      capacidade: parseInt(novaCapacidade) || 0,
    };

    try {
      if (editandoSala) {
        // Editando sala existente
        await axios.put(`${API_URL}/sala/${editandoSala.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Criando nova sala
        await axios.post(`${API_URL}/sala/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setNovaSala("");
      setNovaCapacidade("");
      setEditandoSala(null);
      carregarSalas(token);
    } catch (error) {
      console.error("Erro ao adicionar/editar sala", error);
    }
  };

  const deletarSala = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/sala/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      carregarSalas(token);
    } catch (error) {
      console.error("Erro ao deletar sala", error);
    }
  };

  const iniciarEdicao = (sala) => {
    setNovaSala(sala.name);
    setNovaCapacidade(sala.capacidade);
    setEditandoSala(sala);
  };

  const cancelarEdicao = () => {
    setNovaSala("");
    setNovaCapacidade("");
    setEditandoSala(null);
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
    <div className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold">Sistema de Ensalamento</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setLogado(false);
          setSalas([]);
        }}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Sair
      </button>

      <div className="mt-5 flex gap-2">
        <input
          type="text"
          placeholder="Nome da sala"
          value={novaSala}
          onChange={(e) => setNovaSala(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Capacidade"
          value={novaCapacidade}
          onChange={(e) => setNovaCapacidade(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={adicionarOuEditarSala}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editandoSala ? "Salvar Edição" : "Adicionar Sala"}
        </button>
        {editandoSala && (
          <button
            onClick={cancelarEdicao}
            className="bg-gray-400 text-white p-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>

      <ul className="mt-5 max-w-xl w-full">
        {salas.map((sala) => (
          <li
            key={sala.id}
            className="border p-2 my-2 rounded shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <strong>{sala.name}</strong> — Capacidade: {sala.capacidade}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => iniciarEdicao(sala)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => deletarSala(sala.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
