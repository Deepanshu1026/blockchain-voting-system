export default function AdminDashboard() {
    return (
        <div style={{
            padding: "40px",
            color: "white",
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Admin Dashboard</h1>
            <div style={{
                background: "#111",
                padding: "30px",
                borderRadius: "12px",
                border: "1px solid #333",
                textAlign: "center"
            }}>
                <p style={{ color: "#aaa", fontSize: "1.2rem" }}>
                    Welcome Admin.
                </p>
                <p style={{ color: "#666", marginTop: "10px" }}>
                    Manage candidates, elections, and verify voters here.
                </p>
            </div>
        </div>
    );
}
