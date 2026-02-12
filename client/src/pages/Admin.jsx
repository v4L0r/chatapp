import API_URL from "../api";

export default function Admin() {
    const token = localStorage.getItem("token");
  
    const loadAdminData = async () => {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(JSON.stringify(data, null, 2));
      } else {
        alert(data.message || "Access denied");
      }
    };
  
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Admin Panel</h2>
        <p>Only admins should be able to see this.</p>
  
        <button onClick={loadAdminData}>Load Admin Data</button>
      </div>
    );
  }