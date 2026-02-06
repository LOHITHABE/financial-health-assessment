import React, { useState } from "react";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    revenue: "",
    expenses: "",
    loan_payment: "",
    cash_inflow: "",
    cash_outflow: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://financial-health-assessment-5z2r.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch data from backend");
    }
  };

  const getStatusColor = (status) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "At Risk") return "#facc15";
    return "#ef4444";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Financial Health Dashboard</h1>
        <p style={styles.subtitle}>AI-powered SME financial assessment</p>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="revenue" placeholder="Total Revenue" onChange={handleChange} style={styles.input} />
          <input name="expenses" placeholder="Total Expenses" onChange={handleChange} style={styles.input} />
          <input name="loan_payment" placeholder="Loan Payment" onChange={handleChange} style={styles.input} />
          <input name="cash_inflow" placeholder="Cash Inflow" onChange={handleChange} style={styles.input} />
          <input name="cash_outflow" placeholder="Cash Outflow" onChange={handleChange} style={styles.input} />

          <button type="submit" style={styles.button}>
            Analyze Financial Health
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {/* OUTPUT */}
        {result && (
          <div style={styles.card}>
            <h2 style={styles.score}>
              {result.metrics.financial_health_score}/100
            </h2>

            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(result.metrics.status)
              }}
            >
              {result.metrics.status}
            </span>

            <div style={styles.metrics}>
              <p><b>Net Profit:</b> ₹{result.metrics.net_profit}</p>
              <p><b>Profit Margin:</b> {result.metrics.profit_margin}%</p>
              <p><b>Cash Flow:</b> ₹{result.metrics.cash_flow}</p>
              <p><b>Debt Ratio:</b> {result.metrics.debt_ratio}%</p>
            </div>

            <div style={styles.aiBox}>
              <h3>AI Insights</h3>
              <p>{result.ai_insights.summary}</p>
              <ul>
                {result.ai_insights.recommendations.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #020617)",
    padding: "40px",
    color: "#fff",
    fontFamily: "Inter, sans-serif"
  },

  container: {
    maxWidth: "720px",
    margin: "auto"
  },

  title: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    textShadow: "0 4px 20px rgba(99,102,241,0.6)"
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "30px"
  },

  form: {
    display: "grid",
    gap: "12px"
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    backgroundColor: "#020617",
    color: "#fff",
    fontSize: "14px"
  },

  button: {
    padding: "14px",
    marginTop: "10px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(99,102,241,0.6)"
  },

  card: {
    marginTop: "40px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 30px rgba(0,0,0,0.4)"
  },

  score: {
    fontSize: "56px",
    fontWeight: "900",
    margin: "0",
    background: "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 25px rgba(99,102,241,0.6)"
  },

  statusBadge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 18px",
    borderRadius: "999px",
    fontWeight: "700",
    color: "#020617",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)"
  },

  metrics: {
    marginTop: "20px",
    lineHeight: "1.8",
    color: "#f1f5f9"
  },

  aiBox: {
    marginTop: "25px",
    padding: "18px",
    borderRadius: "14px",
    background: "rgba(99,102,241,0.12)",
    boxShadow: "0 0 20px rgba(99,102,241,0.3)"
  },

  error: {
    marginTop: "10px",
    color: "#ef4444"
  }
};
