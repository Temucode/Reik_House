// pages/Register.tsx
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendeur");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("https://aaa7-103-212-162-27.ngrok-free.app/api/users/register", {
        username: userName, // Change "nom" en "username"
        password,
        role,
      });
      console.log("Utilisateur créé avec succès", response.data);
      // Rediriger vers la page de connexion, etc.
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };
  

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="vendeur">Vendeur</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
