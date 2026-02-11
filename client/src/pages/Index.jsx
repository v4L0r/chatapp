import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <p>This is the landing page.</p>

      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </div>
  );
}