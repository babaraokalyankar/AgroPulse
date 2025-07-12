import { type NextRequest, NextResponse } from "next/server"

// Simulated ML model predictions based on the original Python model logic
function predictTurmericDisease(data: any) {
  const { soil_moisture, soil_pH, temperature, rainfall, humidity, irrigation_type, fertilizer_type, pesticide_usage } =
    data

  // Convert string inputs to numbers
  const moisture = Number.parseFloat(soil_moisture)
  const pH = Number.parseFloat(soil_pH)
  const temp = Number.parseFloat(temperature)
  const rain = Number.parseFloat(rainfall)
  const humid = Number.parseFloat(humidity)
  const pesticide = Number.parseFloat(pesticide_usage)

  // Simplified prediction logic based on patterns from the dataset
  const diseaseScores = {
    None: 0.25,
    Mild: 0.25,
    Moderate: 0.25,
    Severe: 0.25,
  }

  // Adjust scores based on conditions
  if (moisture < 15 || moisture > 40) {
    diseaseScores["Severe"] += 0.2
    diseaseScores["None"] -= 0.1
  }

  if (pH < 5.5 || pH > 8.5) {
    diseaseScores["Moderate"] += 0.15
    diseaseScores["None"] -= 0.1
  }

  if (temp > 32 || temp < 18) {
    diseaseScores["Mild"] += 0.1
    diseaseScores["Severe"] += 0.1
  }

  if (rain > 250 || rain < 50) {
    diseaseScores["Moderate"] += 0.15
  }

  if (humid > 85 || humid < 45) {
    diseaseScores["Severe"] += 0.1
  }

  if (pesticide > 40) {
    diseaseScores["Mild"] += 0.1
  }

  // Irrigation and fertilizer effects
  if (irrigation_type === "Manual") {
    diseaseScores["Moderate"] += 0.05
  }

  if (fertilizer_type === "Organic") {
    diseaseScores["None"] += 0.1
    diseaseScores["Severe"] -= 0.05
  }

  // Normalize scores
  const total = Object.values(diseaseScores).reduce((a, b) => a + b, 0)
  Object.keys(diseaseScores).forEach((key) => {
    diseaseScores[key as keyof typeof diseaseScores] = Math.max(
      0,
      diseaseScores[key as keyof typeof diseaseScores] / total,
    )
  })

  // Find most likely disease
  const mostLikely = Object.entries(diseaseScores).reduce((a, b) =>
    diseaseScores[a[0] as keyof typeof diseaseScores] > diseaseScores[b[0] as keyof typeof diseaseScores] ? a : b,
  )[0]

  // Get recommendations
  const recommendations = {
    None: `Your crop appears healthy. Use balanced organic fertilizers like compost or well-rotted manure.
Maintain consistent irrigation using drip or sprinkler methods.
Regularly test soil for nutrients and pH balance.
Apply biofertilizers like Azospirillum and Phosphobacteria to boost growth.`,

    Mild: `Monitor the crop closely for early symptoms.
Apply neem oil spray every 7 days as a natural preventive.
Use biofertilizers and compost to strengthen crop immunity.
Improve soil aeration and avoid overwatering.`,

    Moderate: `Apply mild fungicides like Mancozeb (2g/l) or Copper Oxychloride.
Remove visibly infected plants and leaves.
Enhance field drainage and reduce moisture stagnation.
Maintain crop spacing and avoid overhead irrigation.`,

    Severe: `Immediate intervention required. Use a broad-spectrum fungicide or bactericide.
Remove and destroy heavily infected plants.
Disinfect farm tools and avoid working in wet fields to prevent spread.
Apply Trichoderma or Pseudomonas bio-control agents in soil.
Rotate crop with non-host varieties for next season.`,
  }

  return {
    predictions: Object.entries(diseaseScores).map(([disease, probability]) => ({
      disease,
      probability,
    })),
    most_likely: mostLikely,
    recommendation: recommendations[mostLikely as keyof typeof recommendations],
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "soil_moisture",
      "soil_pH",
      "temperature",
      "rainfall",
      "humidity",
      "irrigation_type",
      "fertilizer_type",
      "pesticide_usage",
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const prediction = predictTurmericDisease(data)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
