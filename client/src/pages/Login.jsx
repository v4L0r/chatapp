import {useState, useContext} from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async (e)=> {
        e.preventDefault();
        
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,password}),
    });
    
    const data = await res.json();
    
    if (res.ok) {
        login(data.token);
        navigate("/chat");
        alert("Logged in successfully.");
    } else {
        alert(data.message);
    }
    };

    return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}













