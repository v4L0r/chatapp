import { useContext } from "react";
import { AuthContext } from "../pages/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "1rem",
        gap: "1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      {token ? (
        <>
          <div>
            Logged in as <strong>{user?.username}</strong>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <div>You are not logged in</div>
      )}
    </div>
  );
}