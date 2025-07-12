import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import os from "os"

// This is a mock implementation since we can't run TensorFlow directly in Next.js API routes
// In a real implementation, you would either:
// 1. Use a serverless function that supports Python/TensorFlow
// 2. Set up a separate Python API service
// 3. Convert the model to TensorFlow.js

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Save the image to a temporary file
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a temporary file path
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.jpg`)

    // Write the file
    await fs.writeFile(tempFilePath, buffer)

    // In a real implementation, you would call your Python model here
    // For now, we'll simulate a response

    // Mock disease classes and their descriptions
    const diseaseClasses = ["Healthy", "Leaf Spot", "Leaf Blight", "Rhizome Rot", "Root Rot"]

    // Simulate model prediction (random for demo)
    const randomIndex = Math.floor(Math.random() * diseaseClasses.length)
    const predictedClass = diseaseClasses[randomIndex]

    // Generate mock confidence scores
    const confidenceScores: Record<string, number> = {}
    let totalScore = 0

    diseaseClasses.forEach((disease) => {
      if (disease === predictedClass) {
        confidenceScores[disease] = 0.7 + Math.random() * 0.25 // 70-95% for predicted class
      } else {
        confidenceScores[disease] = Math.random() * 0.2 // 0-20% for other classes
      }
      totalScore += confidenceScores[disease]
    })

    // Normalize scores to sum to 1
    Object.keys(confidenceScores).forEach((key) => {
      confidenceScores[key] = confidenceScores[key] / totalScore
    })

    // Generate recommendations based on predicted class
    const recommendations = getRecommendations(predictedClass)

    // Clean up the temporary file
    await fs.unlink(tempFilePath)

    return NextResponse.json({
      disease_class: predictedClass,
      confidence_scores: confidenceScores,
      recommendations,
    })
  } catch (error) {
    console.error("Image prediction error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}

function getRecommendations(diseaseClass: string): string[] {
  const recommendationMap: Record<string, string[]> = {
    Healthy: [
      "Continue with regular watering schedule of 2-3 times per week.",
      "Maintain organic mulch around plants to preserve soil moisture.",
      "Apply balanced NPK fertilizer (5-5-5) every 2-3 months.",
      "Monitor for early signs of pest activity with weekly inspections.",
    ],
    "Leaf Spot": [
      "Remove and destroy infected leaves immediately.",
      "Apply copper-based fungicide every 7-10 days until symptoms subside.",
      "Improve air circulation by proper spacing between plants.",
      "Avoid overhead irrigation; water at soil level only.",
      "Apply neem oil spray as a preventive measure every 14 days.",
    ],
    "Leaf Blight": [
      "Remove severely infected plants and destroy them.",
      "Apply systemic fungicide containing azoxystrobin or propiconazole.",
      "Maintain proper drainage in the field to prevent water stagnation.",
      "Rotate crops with non-host plants for at least 2 years.",
      "Apply Trichoderma-based bio-fungicides to soil.",
    ],
    "Rhizome Rot": [
      "Immediately isolate affected plants to prevent spread.",
      "Drench soil with copper oxychloride solution (2g/liter).",
      "Improve drainage by adding organic matter to soil.",
      "Treat seed rhizomes with Trichoderma viride before planting.",
      "Reduce irrigation frequency and monitor soil moisture levels.",
    ],
    "Root Rot": [
      "Remove affected plants including all root material.",
      "Apply fungicide containing metalaxyl or fosetyl-aluminum to surrounding plants.",
      "Improve soil drainage by adding sand or perlite to heavy soils.",
      "Avoid excessive nitrogen fertilization.",
      "Implement crop rotation with non-susceptible crops for 3-4 years.",
    ],
  }

  return (
    recommendationMap[diseaseClass] || [
      "Consult with a plant pathologist for accurate diagnosis.",
      "Monitor plant health closely and document any changes.",
      "Ensure proper growing conditions including adequate sunlight and water.",
    ]
  )
}
