import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [signIn, { loading, error }] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.signIn);
      navigate("/dashboard");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Veuillez remplir tous les champs.");
    try {
      await signIn({ variables: { email, password } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <p>Pas encore de compte ?</p>
      <button onClick={() => navigate("/register")}>S'inscrire</button>
    </div>
  );
};

export default LoginPage;
