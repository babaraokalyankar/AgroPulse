"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Microscope,
  Leaf,
  FileText,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  BarChart3,
  Activity,
} from "lucide-react"
import { generateProfessionalPDF } from "@/lib/pdf-generator"
import { useLanguage } from "@/hooks/use-language"

interface PredictionResultsProps {
  results: any
  onBack: () => void
  onNewPrediction: () => void
}

export default function PredictionResults({ results, onBack, onNewPrediction }: PredictionResultsProps) {
  const { turmeric, bacillus, formData } = results
  const { t } = useLanguage()

  const getSeverityIcon = (disease: string) => {
    if (disease === "None") return <CheckCircle className="w-5 h-5 text-emerald-400" />
    if (disease === "Mild") return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    if (disease === "Moderate") return <AlertTriangle className="w-5 h-5 text-orange-400" />
    if (disease === "Severe") return <AlertTriangle className="w-5 h-5 text-red-400" />
    return <AlertTriangle className="w-5 h-5 text-gray-400" />
  }

  const getSeverityColor = (disease: string) => {
    if (disease === "None") return "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
    if (disease === "Mild") return "bg-yellow-500/20 border-yellow-400/30 text-yellow-300"
    if (disease === "Moderate") return "bg-orange-500/20 border-orange-400/30 text-orange-300"
    if (disease === "Severe") return "bg-red-500/20 border-red-400/30 text-red-300"
    return "bg-gray-500/20 border-gray-400/30 text-gray-300"
  }

  const getHealthIcon = (status: string) => {
    if (status === "Excellent" || status === "Good") return <TrendingUp className="w-5 h-5 text-emerald-400" />
    if (status === "Poor") return <TrendingDown className="w-5 h-5 text-red-400" />
    return <TrendingUp className="w-5 h-5 text-yellow-400" />
  }

  const exportPDF = () => {
    generateProfessionalPDF(results)
  }

  const shareResults = () => {
    const currentUrl = window.location.origin
    const shareText = `Check out my agricultural analysis from AgroPulse! Disease status: ${turmeric.most_likely}, Soil health: ${bacillus.health_status}. Visit: ${currentUrl}`

    // Use clipboard API as the primary sharing method (more reliable)
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert("Analysis results copied to clipboard! You can now paste and share it.")
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
        // If clipboard fails, offer manual selection
        const textArea = document.createElement("textarea")
        textArea.value = shareText
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand("copy")
          alert("Analysis results copied to clipboard! You can now paste and share it.")
        } catch (err) {
          alert("Please manually select and copy the text to share: " + shareText)
        }
        document.body.removeChild(textArea)
      })
  }

  const parameterCards = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: t("soilPH"),
      value: formData.soil_pH,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: t("temperature"),
      value: `${formData.temperature}°C`,
      gradient: "from-red-500 to-orange-500",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: t("rainfall"),
      value: `${formData.rainfall}mm`,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: t("humidity"),
      value: `${formData.humidity}%`,
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: t("soilMoisture"),
      value: `${formData.soil_moisture}%`,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      label: t("irrigation"),
      value: formData.irrigation_type,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      label: t("fertilizer"),
      value: formData.fertilizer_type,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Sun className="w-5 h-5" />,
      label: t("season"),
      value: formData.season,
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-indigo-900">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Harvest')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-lg">🌱</span>
                </div>
                AgroPulse
              </Button>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">{t("analysisResults")}</h1>
                <p className="text-gray-300">{t("analysisDesc")}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportPDF}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t("exportPDF")}
              </Button>
              <Button
                variant="outline"
                onClick={shareResults}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("share")}
              </Button>
              <Button onClick={onNewPrediction} className="bg-gradient-to-r from-emerald-500 to-teal-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t("newAnalysis")}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Turmeric Disease Prediction */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Leaf className="w-6 h-6" />
                  {t("cropDisease")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(turmeric.most_likely)} mb-4 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getSeverityIcon(turmeric.most_likely)}
                    <span className="text-xl font-bold">{turmeric.most_likely}</span>
                  </div>
                  <p className="text-sm opacity-80">Primary disease status detected</p>
                </div>

                <div className="space-y-3">
                  {turmeric.predictions.map((pred: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-sm"
                    >
                      <span className="font-medium text-white">{pred.disease}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={pred.probability * 100} className="w-20 h-2" />
                        <Badge variant="secondary" className="w-12 text-center">
                          {(pred.probability * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bacillus Bacteria Analysis */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Microscope className="w-6 h-6" />
                  {t("soilHealth")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-blue-300">{bacillus.predicted_count.toLocaleString()}</div>
                    <div className="text-sm text-blue-400">CFU/g</div>
                  </div>
                  <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-400/30 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      {getHealthIcon(bacillus.health_status)}
                      <span className="font-bold text-emerald-300">{bacillus.health_status}</span>
                    </div>
                    <div className="text-sm text-emerald-400">Soil Health</div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-gray-300 mb-1">Confidence Level</div>
                  <div className="flex items-center gap-3">
                    <Progress value={bacillus.confidence * 100} className="flex-1 h-2" />
                    <Badge variant="secondary">{(bacillus.confidence * 100).toFixed(1)}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Analysis Parameters */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl mb-8">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-8 h-8" />
                  <Activity className="w-6 h-6" />
                </div>
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-bold">
                  {t("analysisParameters")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {parameterCards.map((param, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg bg-gradient-to-br ${param.gradient} bg-opacity-20 border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${param.gradient}`}>{param.icon}</div>
                      <div className="text-sm text-gray-300 font-medium">{param.label}</div>
                    </div>
                    <div className="text-xl font-bold text-white">{param.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turmeric Recommendations */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Crop Management Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm">
                  <div className="space-y-3">
                    {turmeric.recommendation
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                            {i + 1}
                          </div>
                          <span className="text-white leading-relaxed">{line.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
