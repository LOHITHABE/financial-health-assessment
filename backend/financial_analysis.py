def analyze_financials(data):
    revenue = data["revenue"]
    expenses = data["expenses"]
    loan_payment = data["loan_payment"]
    cash_inflow = data["cash_inflow"]
    cash_outflow = data["cash_outflow"]

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

    return {
        "net_profit": net_profit,
        "profit_margin": round(profit_margin, 2),
        "cash_flow": cash_flow,
        "debt_ratio": round(debt_ratio, 2),
        "financial_health_score": score
    }
