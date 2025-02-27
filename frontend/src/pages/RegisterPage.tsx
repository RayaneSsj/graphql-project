import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const SIGN_UP = gql`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password)
  }
`;

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signUp({ variables: { name, email, password } });
      if (response.data.signUp) {
        alert("Compte créé avec succès !");
        navigate("/login");
      }
    } catch (err) {
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Pseudo" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "S'inscrire"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default RegisterPage;
