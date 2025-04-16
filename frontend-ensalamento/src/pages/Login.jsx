import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080"; // Altere conforme necessário

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const fazerLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token); // Salva o token no localStorage
      navigate("/salas"); // Redireciona para a tela de salas
    } catch (error) {
      setErro("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {erro && <p className="text-red-500">{erro}</p>}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <button onClick={fazerLogin} className="bg-blue-500 text-white p-2 rounded">
        Entrar
      </button>
    </div>
  );
}
