def generate_ai_recommendation(metrics):
    score = metrics["financial_health_score"]

    if score >= 75:
        status = "Healthy"
        advice = [
            "You are managing finances efficiently.",
            "You may explore expansion or investment opportunities.",
            "Maintain current cost control measures."
        ]
    elif score >= 50:
        status = "Stable"
        advice = [
            "Monitor expenses closely.",
            "Improve cash flow by faster receivables collection.",
            "Consider working capital optimization."
        ]
    else:
        status = "At Risk"
        advice = [
            "Reduce operational expenses immediately.",
            "Avoid taking additional debt.",
            "Focus on improving monthly cash inflows."
        ]

    return {
        "business_status": status,
        "recommendations": advice
    }
