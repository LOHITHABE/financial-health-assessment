from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from groq import Groq

# ✅ LOAD .env FILE
load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ GROQ CLIENT
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.route("/", methods=["GET"])
def home():
    return "Financial Health Assessment API is running"


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        revenue = float(data["revenue"])
        expenses = float(data["expenses"])
        loan_payment = float(data["loan_payment"])
        cash_inflow = float(data["cash_inflow"])
        cash_outflow = float(data["cash_outflow"])

        # ===== Calculations =====
        net_profit = revenue - expenses - loan_payment
        profit_margin = (net_profit / revenue) * 100 if revenue else 0
        cash_flow = cash_inflow - cash_outflow
        debt_ratio = (loan_payment / revenue) * 100 if revenue else 0

        score = int(
            profit_margin * 0.4 +
            (cash_flow / 10000) * 0.4 +
            (100 - debt_ratio) * 0.2
        )
        score = max(0, min(score, 100))

        status = (
            "Healthy" if score >= 70 else
            "At Risk" if score >= 40 else
            "Critical"
        )

        metrics = {
            "net_profit": net_profit,
            "profit_margin": round(profit_margin, 2),
            "cash_flow": cash_flow,
            "debt_ratio": round(debt_ratio, 2),
            "financial_health_score": score,
            "status": status
        }

        ai_insights = generate_ai_recommendation(metrics)

        return jsonify({
            "metrics": metrics,
            "ai_insights": ai_insights
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= AI ANALYSIS =================
def generate_ai_recommendation(metrics):
    try:
        prompt = f"""
You are a professional financial advisor for small businesses.

Analyze the data and respond ONLY in JSON.

Metrics:
Net Profit: {metrics['net_profit']}
Profit Margin: {metrics['profit_margin']}%
Cash Flow: {metrics['cash_flow']}
Debt Ratio: {metrics['debt_ratio']}%
Health Score: {metrics['financial_health_score']}
Status: {metrics['status']}

Return JSON strictly in this format:
{{
  "summary": "short financial assessment",
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ]
}}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4
        )

        return eval(response.choices[0].message.content)

    except Exception as e:
        return {
            "summary": "AI analysis failed",
            "recommendations": [str(e)]
        }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

