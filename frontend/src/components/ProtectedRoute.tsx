import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // State pour gérer le chargement
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Après un délai, mettre à jour l'état de chargement à false
    setIsLoading(false);
  }, []);

  // Si le token est présent, on rend les enfants (page protégée)
  if (isLoading) {
    return <div>Loading...</div>; // Optionnel : tu peux afficher un message de "chargement" ou spinner ici.
  }

  // Si le token n'est pas présent, on redirige vers la page de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si le token est présent, on rend les enfants
  return <>{children}</>;
};

export default ProtectedRoute;
