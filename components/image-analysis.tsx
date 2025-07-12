"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Camera, AlertTriangle, CheckCircle, Info, ArrowLeft } from "lucide-react"
import SafeHydrate from "./safe-hydrate"
import ErrorBoundary from "./error-boundary"

interface AnalysisResult {
  disease_class: string
  confidence_scores: Record<string, number>
  recommendations: string[]
  classification_report?: string
  demo_mode?: boolean
}

interface ImageAnalysisProps {
  onBack?: () => void
}

export default function ImageAnalysis({ onBack }: ImageAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    } else {
      setError("Please upload an image file (JPG, PNG, etc.)")
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Generate demo results directly without API call
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate processing time

      const demoResult = generateDemoResults(fileName)
      setResult(demoResult)
    } catch (err: any) {
      setError("Analysis failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetForm = () => {
    setSelectedImage(null)
    setFileName("")
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function generateDemoResults(fileName: string): AnalysisResult {
    // Simulate different results based on filename or random selection
    const diseases = ["Healthy", "Leaf Spot", "Leaf Blight", "Rhizome Rot", "Root Rot"]
    const randomIndex = Math.floor(Math.random() * diseases.length)
    const predictedDisease = diseases[randomIndex]

    // Generate realistic confidence scores
    const confidenceScores: Record<string, number> = {}
    diseases.forEach((disease) => {
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

  return (
    <SafeHydrate fallback={<div className="p-4">Loading image analysis tool...</div>}>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🖼️ Turmeric Plant Image Analysis
                </h2>
                <p className="text-gray-600">Upload plant images for CNN-based disease detection</p>
              </div>
            </div>

            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            )}
          </div>

          {/* Demo Mode Notice */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This feature is running in demo mode with simulated results.
            </AlertDescription>
          </Alert>

          <Card className="border-purple-200/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Camera className="h-5 w-5" />
                Image Upload & Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!result ? (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                      selectedImage
                        ? "border-purple-400 bg-purple-50/50"
                        : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/30"
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    {selectedImage ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto max-w-sm overflow-hidden rounded-lg border-2 border-purple-200">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Selected plant"
                            className="h-auto w-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-purple-600 font-medium">{fileName}</p>
                        <p className="text-xs text-gray-500">Image ready for analysis</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                          <Upload className="h-12 w-12 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700">Drag and drop an image or click to browse</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Upload a clear image of turmeric plant leaves for disease analysis
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, JPEG (Max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    {selectedImage && (
                      <Button variant="outline" onClick={resetForm} className="border-purple-200">
                        Reset
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedImage || loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing with CNN Model...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Demo Mode Banner */}
                  {result.demo_mode && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Demo Mode:</strong> This is a simulated result for demonstration purposes.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-purple-700">Uploaded Image</h4>
                      <div className="rounded-lg overflow-hidden border-2 border-purple-200">
                        <img
                          src={selectedImage! || "/placeholder.svg"}
                          alt="Analyzed plant"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {result.disease_class.toLowerCase().includes("healthy") ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-8 w-8 text-orange-500" />
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{result.disease_class}</h3>
                          <p className="text-sm text-gray-600">Disease Classification</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-700">Confidence Scores</h4>
                        {Object.entries(result.confidence_scores).map(([disease, score]: [string, any]) => (
                          <div
                            key={disease}
                            className={`p-3 rounded-lg transition-all ${
                              disease === result.disease_class
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-700">{disease}</span>
                              <span className="text-sm font-bold text-purple-600">{(score * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-white rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  disease === result.disease_class
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                    : "bg-gray-300"
                                }`}
                                style={{ width: `${score * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Treatment Recommendations
                    </h4>
                    <div className="space-y-2">
                      {result.recommendations.map((rec: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-green-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.classification_report && (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold mb-2 text-gray-700">Classification Report</h4>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                        {result.classification_report}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={resetForm} className="border-purple-200">
                      <Camera className="mr-2 h-4 w-4" />
                      Analyze Another Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-amber-800">How It Works</h4>
              <p className="text-sm text-amber-700">
                This demo shows how your CNN model would analyze turmeric plant images to identify diseases and provide
                treatment recommendations. The interface is fully functional and demonstrates the user experience of the
                disease detection system.
              </p>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </SafeHydrate>
  )
}
