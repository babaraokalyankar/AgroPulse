import { type NextRequest, NextResponse } from "next/server"

// Simulated LSTM model predictions for Bacillus bacteria count
function predictBacillusCount(data: any) {
  const { soil_temperature, rainfall_amount, soil_pH, uv_index, season, soil_texture, tillage_practice } = data

  // Convert inputs to numbers
  const temp = Number.parseFloat(soil_temperature)
  const rainfall = Number.parseFloat(rainfall_amount)
  const pH = Number.parseFloat(soil_pH)
  const uv = Number.parseFloat(uv_index)

  // Base bacteria count (average from dataset: ~400,000 CFU/g)
  let baseCount = 400000

  // Temperature effects (optimal around 25-30°C)
  if (temp >= 25 && temp <= 30) {
    baseCount *= 1.2
  } else if (temp < 20 || temp > 35) {
    baseCount *= 0.8
  }

  // pH effects (optimal around 6.5-7.5)
  if (pH >= 6.5 && pH <= 7.5) {
    baseCount *= 1.15
  } else if (pH < 5.5 || pH > 8.5) {
    baseCount *= 0.7
  }

  // Rainfall effects (moderate rainfall is beneficial)
  if (rainfall >= 80 && rainfall <= 150) {
    baseCount *= 1.1
  } else if (rainfall > 200 || rainfall < 30) {
    baseCount *= 0.85
  }

  // UV effects (moderate UV is beneficial)
  if (uv >= 5 && uv <= 8) {
    baseCount *= 1.05
  } else if (uv > 10 || uv < 2) {
    baseCount *= 0.9
  }

  // Season effects
  if (season === "Monsoon") {
    baseCount *= 1.1
  } else if (season === "Summer") {
    baseCount *= 0.95
  }

  // Soil texture effects
  if (soil_texture === "Loamy") {
    baseCount *= 1.15
  } else if (soil_texture === "Clay") {
    baseCount *= 1.05
  } else if (soil_texture === "Sandy") {
    baseCount *= 0.9
  }

  // Tillage practice effects
  if (tillage_practice === "Low") {
    baseCount *= 1.1
  } else if (tillage_practice === "No") {
    baseCount *= 1.05
  } else if (tillage_practice === "High") {
    baseCount *= 0.9
  }

  // Add some randomness to simulate model uncertainty
  const randomFactor = 0.9 + Math.random() * 0.2 // ±10% variation
  const finalCount = Math.round(baseCount * randomFactor)

  // Determine health status
  let healthStatus = "Average"
  if (finalCount > 450000) {
    healthStatus = "Excellent"
  } else if (finalCount > 380000) {
    healthStatus = "Good"
  } else if (finalCount < 300000) {
    healthStatus = "Poor"
  }

  // Generate recommendations based on conditions
  const recommendations = []

  if (temp < 25) {
    recommendations.push("Consider soil warming techniques or wait for warmer weather for optimal bacteria growth")
  } else if (temp > 30) {
    recommendations.push("Provide shade or mulching to reduce soil temperature stress")
  }

  if (pH < 6.5) {
    recommendations.push("Apply lime to increase soil pH for better bacteria activity")
  } else if (pH > 7.5) {
    recommendations.push("Add organic matter or sulfur to slightly reduce soil pH")
  }

  if (rainfall < 80) {
    recommendations.push("Increase irrigation to maintain adequate soil moisture")
  } else if (rainfall > 150) {
    recommendations.push("Improve drainage to prevent waterlogging")
  }

  if (soil_texture === "Sandy") {
    recommendations.push("Add organic compost to improve soil structure and water retention")
  } else if (soil_texture === "Clay") {
    recommendations.push("Add organic matter to improve soil aeration")
  }

  if (tillage_practice === "High") {
    recommendations.push("Reduce tillage intensity to preserve beneficial soil microorganisms")
  }

  recommendations.push("Apply organic compost or bio-fertilizers to boost beneficial bacteria")
  recommendations.push("Maintain consistent soil moisture and avoid chemical pesticide overuse")

  // Calculate confidence (higher for values closer to average)
  const avgCount = 400000
  const deviation = Math.abs(finalCount - avgCount) / avgCount
  const confidence = Math.max(0.7, 1 - deviation)

  return {
    predicted_count: finalCount,
    health_status: healthStatus,
    recommendations,
    confidence,
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "soil_temperature",
      "rainfall_amount",
      "soil_pH",
      "uv_index",
      "season",
      "soil_texture",
      "tillage_practice",
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const prediction = predictBacillusCount(data)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
