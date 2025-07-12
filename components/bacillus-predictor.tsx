"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface BacillusFormData {
  soil_temperature: string
  rainfall_amount: string
  soil_pH: string
  uv_index: string
  season: string
  soil_texture: string
  tillage_practice: string
}

interface BacillusResult {
  predicted_count: number
  health_status: string
  recommendations: string[]
  confidence: number
}

export default function BacillusPredictor() {
  const [formData, setFormData] = useState<BacillusFormData>({
    soil_temperature: "",
    rainfall_amount: "",
    soil_pH: "",
    uv_index: "",
    season: "",
    soil_texture: "",
    tillage_practice: "",
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BacillusResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof BacillusFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/predict-bacillus", {
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

  const getHealthIcon = (status: string) => {
    if (status === "Excellent") return <TrendingUp className="w-5 h-5 text-green-500" />
    if (status === "Good") return <TrendingUp className="w-5 h-5 text-blue-500" />
    if (status === "Average") return <Minus className="w-5 h-5 text-yellow-500" />
    if (status === "Poor") return <TrendingDown className="w-5 h-5 text-red-500" />
    return <Minus className="w-5 h-5 text-gray-500" />
  }

  const getHealthColor = (status: string) => {
    if (status === "Excellent") return "text-green-600 bg-green-50 border-green-200"
    if (status === "Good") return "text-blue-600 bg-blue-50 border-blue-200"
    if (status === "Average") return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (status === "Poor") return "text-red-600 bg-red-50 border-red-200"
    return "text-gray-600 bg-gray-50 border-gray-200"
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="soil_temperature">Soil Temperature (°C)</Label>
          <Input
            id="soil_temperature"
            type="number"
            step="0.01"
            placeholder="e.g., 25.5"
            value={formData.soil_temperature}
            onChange={(e) => handleInputChange("soil_temperature", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rainfall_amount">Rainfall Amount (mm)</Label>
          <Input
            id="rainfall_amount"
            type="number"
            step="0.01"
            placeholder="e.g., 120.5"
            value={formData.rainfall_amount}
            onChange={(e) => handleInputChange("rainfall_amount", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="soil_pH">Soil pH</Label>
          <Input
            id="soil_pH"
            type="number"
            step="0.01"
            placeholder="e.g., 6.8"
            value={formData.soil_pH}
            onChange={(e) => handleInputChange("soil_pH", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uv_index">UV Index (UVI)</Label>
          <Input
            id="uv_index"
            type="number"
            step="0.01"
            placeholder="e.g., 7.5"
            value={formData.uv_index}
            onChange={(e) => handleInputChange("uv_index", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">Season</Label>
          <Select onValueChange={(value) => handleInputChange("season", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Summer">Summer</SelectItem>
              <SelectItem value="Monsoon">Monsoon</SelectItem>
              <SelectItem value="Winter">Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="soil_texture">Soil Texture</Label>
          <Select onValueChange={(value) => handleInputChange("soil_texture", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select soil texture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clay">Clay</SelectItem>
              <SelectItem value="Loamy">Loamy</SelectItem>
              <SelectItem value="Sandy">Sandy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tillage_practice">Tillage Practice</Label>
          <Select onValueChange={(value) => handleInputChange("tillage_practice", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tillage practice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High Tillage</SelectItem>
              <SelectItem value="Low">Low Tillage</SelectItem>
              <SelectItem value="No">No Tillage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Soil...
              </>
            ) : (
              "Predict Bacteria Count"
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
                {getHealthIcon(result.health_status)}
                Bacillus Bacteria Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Predicted Count</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.predicted_count.toLocaleString()} CFU/g</p>
                </div>

                <div className={`p-4 rounded-lg border ${getHealthColor(result.health_status)}`}>
                  <h4 className="font-semibold">Soil Health Status</h4>
                  <p className="text-xl font-bold">{result.health_status}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800">Confidence</h4>
                  <p className="text-2xl font-bold text-gray-600">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">🔬 Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
