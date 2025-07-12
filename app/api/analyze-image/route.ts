import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // First, try to connect to local Python service
    try {
      const localFormData = new FormData()
      localFormData.append("image", image)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: localFormData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const result = await response.json()
        return NextResponse.json(result)
      }
    } catch (localError: any) {
      console.log("Local service not available, using demo mode:", localError.message)
    }

    // Fallback: Demo mode with simulated results
    console.log("Running in demo mode - simulating CNN model results")

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate realistic demo results
    const demoResults = generateDemoResults(image.name)

    return NextResponse.json(demoResults)
  } catch (error: any) {
    console.error("Image analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze image. Please try again." }, { status: 500 })
  }
}

function generateDemoResults(fileName: string): any {
  // Simulate different results based on filename or random selection
  const diseases = ["Healthy", "Leaf Spot", "Leaf Blight", "Rhizome Rot", "Root Rot"]
  const randomIndex = Math.floor(Math.random() * diseases.length)
  const predictedDisease = diseases[randomIndex]

  // Generate realistic confidence scores
  const confidenceScores: Record<string, number> = {}
  diseases.forEach((disease, index) => {
    if (disease === predictedDisease) {
      confidenceScores[disease] = 0.75 + Math.random() * 0.2 // 75-95% for predicted
    } else {
      confidenceScores[disease] = Math.random() * 0.25 // 0-25% for others
    }
  })

  // Normalize scores to sum to 1
  const total = Object.values(confidenceScores).reduce((sum, score) => sum + score, 0)
  Object.keys(confidenceScores).forEach((key) => {
    confidenceScores[key] = confidenceScores[key] / total
  })

  const recommendations = getRecommendations(predictedDisease)

  return {
    disease_class: predictedDisease,
    confidence_scores: confidenceScores,
    recommendations: recommendations,
    classification_report: `Demo Mode: Predicted ${predictedDisease} with ${(confidenceScores[predictedDisease] * 100).toFixed(1)}% confidence`,
    demo_mode: true,
  }
}

function getRecommendations(diseaseClass: string): string[] {
  const recommendations: Record<string, string[]> = {
    Healthy: [
      "Continue with regular watering schedule of 2-3 times per week.",
      "Maintain organic mulch around plants to preserve soil moisture.",
      "Apply balanced NPK fertilizer (5-5-5) every 2-3 months.",
      "Monitor for early signs of pest activity with weekly inspections.",
      "Ensure adequate sunlight (6-8 hours daily) for optimal growth.",
    ],
    "Leaf Spot": [
      "Remove and destroy infected leaves immediately to prevent spread.",
      "Apply copper-based fungicide every 7-10 days until symptoms subside.",
      "Improve air circulation by proper spacing between plants (30-45cm apart).",
      "Avoid overhead irrigation; water at soil level only.",
      "Apply neem oil spray as a preventive measure every 14 days.",
      "Ensure proper drainage to prevent water stagnation.",
    ],
    "Leaf Blight": [
      "Remove severely infected plants and destroy them completely.",
      "Apply systemic fungicide containing azoxystrobin or propiconazole.",
      "Maintain proper drainage in the field to prevent water stagnation.",
      "Rotate crops with non-host plants for at least 2 years.",
      "Apply Trichoderma-based bio-fungicides to soil before planting.",
      "Reduce plant density to improve air circulation.",
    ],
    "Rhizome Rot": [
      "Immediately isolate affected plants to prevent disease spread.",
      "Drench soil with copper oxychloride solution (2g/liter water).",
      "Improve drainage by adding organic matter and sand to soil.",
      "Treat seed rhizomes with Trichoderma viride before planting.",
      "Reduce irrigation frequency and monitor soil moisture levels.",
      "Apply carbendazim fungicide to surrounding healthy plants.",
    ],
    "Root Rot": [
      "Remove affected plants including all root material immediately.",
      "Apply fungicide containing metalaxyl or fosetyl-aluminum to surrounding plants.",
      "Improve soil drainage by adding sand or perlite to heavy soils.",
      "Avoid excessive nitrogen fertilization which promotes soft growth.",
      "Implement crop rotation with non-susceptible crops for 3-4 years.",
      "Use raised beds to improve drainage in heavy clay soils.",
    ],
  }

  return (
    recommendations[diseaseClass] || [
      "Consult with a plant pathologist for accurate diagnosis.",
      "Monitor plant health closely and document any changes.",
      "Ensure proper growing conditions including adequate sunlight and water.",
      "Consider soil testing to check for nutrient deficiencies.",
    ]
  )
}
