"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Microscope,
  Leaf,
} from "lucide-react"

interface PredictionResultsProps {
  results: any
  onBack: () => void
  onNewPrediction: () => void
}

export default function PredictionResults({ results, onBack, onNewPrediction }: PredictionResultsProps) {
  const { turmeric, bacillus, formData } = results

  const getSeverityIcon = (disease: string) => {
    if (disease === "None") return <CheckCircle className="w-5 h-5 text-green-500" />
    if (disease === "Mild") return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    if (disease === "Moderate") return <AlertTriangle className="w-5 h-5 text-orange-500" />
    if (disease === "Severe") return <AlertTriangle className="w-5 h-5 text-red-500" />
    return <AlertTriangle className="w-5 h-5 text-gray-500" />
  }

  const getSeverityColor = (disease: string) => {
    if (disease === "None") return "bg-green-50 border-green-200 text-green-800"
    if (disease === "Mild") return "bg-yellow-50 border-yellow-200 text-yellow-800"
    if (disease === "Moderate") return "bg-orange-50 border-orange-200 text-orange-800"
    if (disease === "Severe") return "bg-red-50 border-red-200 text-red-800"
    return "bg-gray-50 border-gray-200 text-gray-800"
  }

  const getHealthIcon = (status: string) => {
    if (status === "Excellent" || status === "Good") return <TrendingUp className="w-5 h-5 text-green-500" />
    if (status === "Poor") return <TrendingDown className="w-5 h-5 text-red-500" />
    return <TrendingUp className="w-5 h-5 text-yellow-500" />
  }

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      turmeric_prediction: turmeric,
      bacillus_prediction: bacillus,
      input_parameters: formData,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `agricultural-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    // Create a shareable URL with encoded data
    const shareText = `Check out my turmeric crop analysis! Disease status: ${turmeric.most_likely}, Soil health: ${bacillus.health_status}`
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(shareUrl, "_blank")
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Harvest')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
                <p className="text-white/80">Comprehensive agricultural intelligence report</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportResults}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={shareResults}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={onNewPrediction} className="bg-gradient-to-r from-green-500 to-green-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Turmeric Disease Prediction */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Leaf className="w-6 h-6" />
                  Crop Disease Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`p-4 rounded-lg border-2 ${getSeverityColor(turmeric.most_likely)} mb-4`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getSeverityIcon(turmeric.most_likely)}
                    <span className="text-xl font-bold">{turmeric.most_likely}</span>
                  </div>
                  <p className="text-sm opacity-80">Primary disease status detected</p>
                </div>

                <div className="space-y-3">
                  {turmeric.predictions.map((pred: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{pred.disease}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={pred.probability * 100} className="w-20 h-2" />
                        <span className="text-sm font-bold w-12">{(pred.probability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bacillus Bacteria Analysis */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Microscope className="w-6 h-6" />
                  Soil Health Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{bacillus.predicted_count.toLocaleString()}</div>
                    <div className="text-sm text-blue-800">CFU/g</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      {getHealthIcon(bacillus.health_status)}
                      <span className="font-bold text-green-800">{bacillus.health_status}</span>
                    </div>
                    <div className="text-sm text-green-700">Soil Health</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Confidence Level</div>
                  <div className="flex items-center gap-3">
                    <Progress value={bacillus.confidence * 100} className="flex-1 h-2" />
                    <span className="text-sm font-bold">{(bacillus.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Turmeric Recommendations */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Crop Management Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className="p-6 prose prose-sm max-w-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/placeholder.svg?height=400&width=600&text=Turmeric+Leaves')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {turmeric.recommendation.split("\n").map((line: string, i: number) => (
                      <p key={i} className="flex items-start gap-2 mb-2">
                        <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bacillus Recommendations */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5" />
                  Soil Enhancement Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className="p-6 space-y-3"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/placeholder.svg?height=400&width=600&text=Soil+Microbes')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {bacillus.recommendations.map((rec: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-100 shadow-sm"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <span className="text-blue-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input Parameters Summary */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-700">📊 Analysis Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Soil pH</div>
                  <div className="font-bold">{formData.soil_pH}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Temperature</div>
                  <div className="font-bold">{formData.temperature}°C</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Rainfall</div>
                  <div className="font-bold">{formData.rainfall}mm</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-bold">{formData.humidity}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Soil Moisture</div>
                  <div className="font-bold">{formData.soil_moisture}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Irrigation</div>
                  <div className="font-bold">{formData.irrigation_type}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Fertilizer</div>
                  <div className="font-bold">{formData.fertilizer_type}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Season</div>
                  <div className="font-bold">{formData.season}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
