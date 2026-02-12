import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./pages/Chat.jsx";
import Admin from "./pages/Admin.jsx";

import Header from "./components/Header";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    // 1. OUTER SHELL: Forces app to be exactly viewport height, no global scroll
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      
      {/* 2. HEADER: Fixed height (defined inside Header component) */}
      <Header />

      {/* 3. MAIN CONTENT AREA: Grows to fill remaining space */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                {/* Chat needs to fill this container */}
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;