import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/auth/login"; // Ajuste conforme seu backend

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const fazerLogin = async () => {
    try {
      const response = await axios.post(
        API_URL,
        JSON.stringify({ email, password }), // Convertendo para JSON
        { headers: { "Content-Type": "application/json" } } // Garantindo o cabeçalho correto
      );

      const token = response.data.token;
      localStorage.setItem("token", token); // Armazena o token
      onLoginSuccess(); // Chama a função para redirecionar após o login
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
