"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface TurmericFormData {
  soil_moisture: string
  soil_pH: string
  temperature: string
  rainfall: string
  humidity: string
  irrigation_type: string
  fertilizer_type: string
  pesticide_usage: string
}

interface PredictionResult {
  predictions: Array<{ disease: string; probability: number }>
  most_likely: string
  recommendation: string
}

export default function TurmericDiseasePredictor() {
  const [formData, setFormData] = useState<TurmericFormData>({
    soil_moisture: "",
    soil_pH: "",
    temperature: "",
    rainfall: "",
    humidity: "",
    irrigation_type: "",
    fertilizer_type: "",
    pesticide_usage: "",
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof TurmericFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/predict-turmeric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to get prediction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityIcon = (disease: string) => {
    if (disease === "None") return <CheckCircle className="w-5 h-5 text-green-500" />
    if (disease === "Mild") return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    if (disease === "Moderate") return <AlertTriangle className="w-5 h-5 text-orange-500" />
    if (disease === "Severe") return <XCircle className="w-5 h-5 text-red-500" />
    return <AlertTriangle className="w-5 h-5 text-gray-500" />
  }

  const getSeverityColor = (disease: string) => {
    if (disease === "None") return "text-green-600 bg-green-50"
    if (disease === "Mild") return "text-yellow-600 bg-yellow-50"
    if (disease === "Moderate") return "text-orange-600 bg-orange-50"
    if (disease === "Severe") return "text-red-600 bg-red-50"
    return "text-gray-600 bg-gray-50"
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="soil_moisture">Soil Moisture (%)</Label>
          <Input
            id="soil_moisture"
            type="number"
            step="0.01"
            placeholder="e.g., 25.5"
            value={formData.soil_moisture}
            onChange={(e) => handleInputChange("soil_moisture", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="soil_pH">Soil pH</Label>
          <Input
            id="soil_pH"
            type="number"
            step="0.01"
            placeholder="e.g., 6.5"
            value={formData.soil_pH}
            onChange={(e) => handleInputChange("soil_pH", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.01"
            placeholder="e.g., 28.5"
            value={formData.temperature}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rainfall">Rainfall (mm)</Label>
          <Input
            id="rainfall"
            type="number"
            step="0.01"
            placeholder="e.g., 150.0"
            value={formData.rainfall}
            onChange={(e) => handleInputChange("rainfall", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="humidity">Humidity (%)</Label>
          <Input
            id="humidity"
            type="number"
            step="0.01"
            placeholder="e.g., 65.0"
            value={formData.humidity}
            onChange={(e) => handleInputChange("humidity", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="irrigation_type">Irrigation Type</Label>
          <Select onValueChange={(value) => handleInputChange("irrigation_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select irrigation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sprinkler">Sprinkler</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="Drip">Drip</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fertilizer_type">Fertilizer Type</Label>
          <Select onValueChange={(value) => handleInputChange("fertilizer_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fertilizer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Organic">Organic</SelectItem>
              <SelectItem value="Inorganic">Inorganic</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pesticide_usage">Pesticide Usage (ml)</Label>
          <Input
            id="pesticide_usage"
            type="number"
            step="0.01"
            placeholder="e.g., 25.0"
            value={formData.pesticide_usage}
            onChange={(e) => handleInputChange("pesticide_usage", e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Predict Disease Status"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSeverityIcon(result.most_likely)}
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.predictions.map((pred, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(pred.disease)}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{pred.disease}</span>
                      <span className="text-sm font-bold">{(pred.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full bg-current opacity-60"
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-lg border-l-4 ${getSeverityColor(result.most_likely)}`}>
                <h4 className="font-semibold mb-2">Most Likely Status: {result.most_likely}</h4>
                <h5 className="font-medium mb-2">🌿 Recommended Actions:</h5>
                <p className="text-sm whitespace-pre-line">{result.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
