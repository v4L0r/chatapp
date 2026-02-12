import React, { useContext } from "react";
import { AuthContext } from "../pages/AuthContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { LogOut, User, MessageSquare } from "lucide-react";

export default function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 relative shadow-sm">
      {/* Left: Brand / Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors"
        onClick={() => navigate("/")}
      >
        <div className="p-2 bg-emerald-100 rounded-lg">
            <MessageSquare size={20} className="text-emerald-600" />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-800">ChatApp</span>
      </div>

      {/* Right: User Info & Actions */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Logged in as</span>
              <span className="text-sm font-semibold text-gray-800">{user?.username}</span>
            </div>
            
            {/* Mobile/Tablet Avatar representation */}
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200">
                <User size={16} />
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <div className="text-sm text-gray-500">
            Guest Mode
          </div>
        )}
      </div>
    </header>
  );
}