"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, AlertTriangle, Thermometer, Droplets, Beaker } from "lucide-react"
import PredictionResults from "@/components/results/prediction-results"

interface UnifiedFormData {
  // Common fields
  soil_pH: string
  temperature: string
  rainfall: string
  humidity: string

  // Turmeric specific
  soil_moisture: string
  irrigation_type: string
  fertilizer_type: string
  pesticide_usage: string

  // Bacillus specific
  uv_index: string
  season: string
  soil_texture: string
  tillage_practice: string
}

interface UnifiedPredictorProps {
  onBack: () => void
  onPrediction: (prediction: any) => void
}

export default function UnifiedPredictor({ onBack, onPrediction }: UnifiedPredictorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<UnifiedFormData>({
    soil_pH: "",
    temperature: "",
    rainfall: "",
    humidity: "",
    soil_moisture: "",
    irrigation_type: "",
    fertilizer_type: "",
    pesticide_usage: "",
    uv_index: "",
    season: "",
    soil_texture: "",
    tillage_practice: "",
  })

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof UnifiedFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.soil_pH && formData.temperature && formData.rainfall && formData.humidity
      case 2:
        return (
          formData.soil_moisture && formData.irrigation_type && formData.fertilizer_type && formData.pesticide_usage
        )
      case 3:
        return formData.uv_index && formData.season && formData.soil_texture && formData.tillage_practice
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get both predictions
      const [turmericResponse, bacillusResponse] = await Promise.all([
        fetch("/api/predict-turmeric", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            soil_moisture: formData.soil_moisture,
            soil_pH: formData.soil_pH,
            temperature: formData.temperature,
            rainfall: formData.rainfall,
            humidity: formData.humidity,
            irrigation_type: formData.irrigation_type,
            fertilizer_type: formData.fertilizer_type,
            pesticide_usage: formData.pesticide_usage,
          }),
        }),
        fetch("/api/predict-bacillus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            soil_temperature: formData.temperature,
            rainfall_amount: formData.rainfall,
            soil_pH: formData.soil_pH,
            uv_index: formData.uv_index,
            season: formData.season,
            soil_texture: formData.soil_texture,
            tillage_practice: formData.tillage_practice,
          }),
        }),
      ])

      if (!turmericResponse.ok || !bacillusResponse.ok) {
        throw new Error("Prediction failed")
      }

      const turmericData = await turmericResponse.json()
      const bacillusData = await bacillusResponse.json()

      const combinedResults = {
        turmeric: turmericData,
        bacillus: bacillusData,
        formData,
        timestamp: new Date().toISOString(),
      }

      setResults(combinedResults)
      onPrediction(combinedResults)
    } catch (err) {
      setError("Failed to get predictions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    return (
      <PredictionResults
        results={results}
        onBack={onBack}
        onNewPrediction={() => {
          setResults(null)
          setCurrentStep(1)
          setFormData({
            soil_pH: "",
            temperature: "",
            rainfall: "",
            humidity: "",
            soil_moisture: "",
            irrigation_type: "",
            fertilizer_type: "",
            pesticide_usage: "",
            uv_index: "",
            season: "",
            soil_texture: "",
            tillage_practice: "",
          })
        }}
      />
    )
  }

  const progress = (currentStep / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-emerald-900 to-teal-900">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Cultivation')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-lg">🌱</span>
              </div>
              AgroPulse Platform
            </Button>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-white">Smart Agricultural Analysis</h1>
              <p className="text-gray-300">Complete crop and soil health assessment</p>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">Step {currentStep} of 3</span>
                <span className="text-sm font-medium text-white">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between mt-4 text-sm">
                <span className={currentStep >= 1 ? "text-emerald-400 font-medium" : "text-gray-400"}>
                  Basic Conditions
                </span>
                <span className={currentStep >= 2 ? "text-emerald-400 font-medium" : "text-gray-400"}>
                  Crop Management
                </span>
                <span className={currentStep >= 3 ? "text-emerald-400 font-medium" : "text-gray-400"}>
                  Environmental Factors
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Form Steps */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                {currentStep === 1 && <Thermometer className="w-6 h-6" />}
                {currentStep === 2 && <Droplets className="w-6 h-6" />}
                {currentStep === 3 && <Beaker className="w-6 h-6" />}
                {currentStep === 1 && "Basic Environmental Conditions"}
                {currentStep === 2 && "Crop Management Details"}
                {currentStep === 3 && "Advanced Environmental Factors"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 1: Basic Conditions */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="soil_pH" className="text-lg font-medium text-white">
                      Soil pH
                    </Label>
                    <Input
                      id="soil_pH"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 6.5"
                      value={formData.soil_pH}
                      onChange={(e) => handleInputChange("soil_pH", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Optimal range: 6.0 - 7.5</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="text-lg font-medium text-white">
                      Temperature (°C)
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 28.5"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Optimal range: 20 - 35°C</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rainfall" className="text-lg font-medium text-white">
                      Rainfall (mm)
                    </Label>
                    <Input
                      id="rainfall"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 150.0"
                      value={formData.rainfall}
                      onChange={(e) => handleInputChange("rainfall", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Monthly rainfall amount</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="humidity" className="text-lg font-medium text-white">
                      Humidity (%)
                    </Label>
                    <Input
                      id="humidity"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 65.0"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange("humidity", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Relative humidity percentage</p>
                  </div>
                </div>
              )}

              {/* Step 2: Crop Management */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="soil_moisture" className="text-lg font-medium text-white">
                      Soil Moisture (%)
                    </Label>
                    <Input
                      id="soil_moisture"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 25.5"
                      value={formData.soil_moisture}
                      onChange={(e) => handleInputChange("soil_moisture", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Current soil moisture content</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="irrigation_type" className="text-lg font-medium text-white">
                      Irrigation Type
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("irrigation_type", value)}>
                      <SelectTrigger className="h-12 text-lg bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select irrigation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Drip">Drip Irrigation</SelectItem>
                        <SelectItem value="Sprinkler">Sprinkler System</SelectItem>
                        <SelectItem value="Manual">Manual Watering</SelectItem>
                        <SelectItem value="Unknown">Other/Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fertilizer_type" className="text-lg font-medium text-white">
                      Fertilizer Type
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("fertilizer_type", value)}>
                      <SelectTrigger className="h-12 text-lg bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select fertilizer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Organic">Organic Fertilizer</SelectItem>
                        <SelectItem value="Inorganic">Chemical Fertilizer</SelectItem>
                        <SelectItem value="Mixed">Mixed (Organic + Chemical)</SelectItem>
                        <SelectItem value="Unknown">Other/Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pesticide_usage" className="text-lg font-medium text-white">
                      Pesticide Usage (ml)
                    </Label>
                    <Input
                      id="pesticide_usage"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 25.0"
                      value={formData.pesticide_usage}
                      onChange={(e) => handleInputChange("pesticide_usage", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Monthly pesticide application</p>
                  </div>
                </div>
              )}

              {/* Step 3: Environmental Factors */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="uv_index" className="text-lg font-medium text-white">
                      UV Index (UVI)
                    </Label>
                    <Input
                      id="uv_index"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 7.5"
                      value={formData.uv_index}
                      onChange={(e) => handleInputChange("uv_index", e.target.value)}
                      className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-400">Daily UV radiation index</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="season" className="text-lg font-medium text-white">
                      Current Season
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("season", value)}>
                      <SelectTrigger className="h-12 text-lg bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select current season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Monsoon">Monsoon</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soil_texture" className="text-lg font-medium text-white">
                      Soil Texture
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("soil_texture", value)}>
                      <SelectTrigger className="h-12 text-lg bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select soil texture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Clay">Clay Soil</SelectItem>
                        <SelectItem value="Loamy">Loamy Soil</SelectItem>
                        <SelectItem value="Sandy">Sandy Soil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tillage_practice" className="text-lg font-medium text-white">
                      Tillage Practice
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("tillage_practice", value)}>
                      <SelectTrigger className="h-12 text-lg bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select tillage method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High Tillage</SelectItem>
                        <SelectItem value="Low">Low Tillage</SelectItem>
                        <SelectItem value="No">No-Till</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-8 py-3 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    Next Step
                    {validateStep(currentStep) && <CheckCircle className="ml-2 w-5 h-5" />}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep(currentStep) || loading}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Get Predictions"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
