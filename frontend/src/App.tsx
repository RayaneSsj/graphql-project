  import { Routes, Route } from "react-router-dom";
  import LoginPage from "./pages/LoginPage";
  import RegisterPage from "./pages/RegisterPage";
  import Dashboard from "./pages/Dashboard";
  import ProtectedRoute from "./components/ProtectedRoute";  // Import de ProtectedRoute
  import CreateArticle from "./components/CreateArticle";

  const App = () => {
    return (
      <Routes>
        {/* Route protégée /dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-article/:id?" element={<CreateArticle />} />

      </Routes>
    );
  };

  export default App;