"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, ImageIcon, AlertTriangle, CheckCircle } from "lucide-react"

export default function ImageDiseasePredictor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
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
    } else {
      setError("Please upload an image file")
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      // Convert base64 to blob
      const base64Response = await fetch(selectedImage)
      const blob = await base64Response.blob()
      formData.append("image", blob, fileName)

      const response = await fetch("/api/predict-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Image prediction failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to analyze image. Please try again.")
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Turmeric Plant Image Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  selectedImage ? "border-green-400" : "border-gray-300"
                } transition-colors duration-200`}
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
                    <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected plant"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-500">{fileName}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Drag and drop an image or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a clear image of a turmeric plant for disease analysis
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                {selectedImage && (
                  <Button variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedImage || loading}
                  className="bg-gradient-to-r from-green-500 to-green-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-1/3">
                  <div className="rounded-lg overflow-hidden border">
                    <img src={selectedImage! || "/placeholder.svg"} alt="Analyzed plant" className="w-full h-auto" />
                  </div>
                </div>
                <div className="w-2/3 space-y-4">
                  <div className="flex items-center gap-2">
                    {result.disease_class === "Healthy" ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                    )}
                    <h3 className="text-xl font-bold">{result.disease_class}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.confidence_scores).map(([disease, score]: [string, any]) => (
                      <div
                        key={disease}
                        className={`p-3 rounded-lg ${
                          disease === result.disease_class
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{disease}</span>
                          <span className="text-sm font-bold">{(score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              disease === result.disease_class ? "bg-green-500" : "bg-gray-300"
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Recommendations:</h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={resetForm}>
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
    </div>
  )
}
