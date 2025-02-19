import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Réinitialiser l'erreur avant une nouvelle tentative
    try {
      const response = await axios.post("https:/aaa7-103-212-162-27.ngrok-free.app/api/user/login", { username, password });

      console.log("Connexion réussie", response.data);
      
      // Stocker le token (s'il est retourné par l'API)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Redirection après connexion (exemple)
      window.location.href = "/dashboard";
    } catch (err: any) {
      // Vérifier si l'erreur a un message spécifique
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur de connexion, veuillez réessayer.");
      }
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
