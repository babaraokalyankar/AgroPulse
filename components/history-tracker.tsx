"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Calendar, Leaf, Microscope } from "lucide-react"

interface HistoryTrackerProps {
  onBack: () => void
  history: any[]
}

export default function HistoryTracker({ onBack, history }: HistoryTrackerProps) {
  const exportHistory = () => {
    const data = {
      export_date: new Date().toISOString(),
      total_predictions: history.length,
      predictions: history,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prediction-history-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Powder')`,
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
                <h1 className="text-3xl font-bold text-white">Prediction History</h1>
                <p className="text-white/80">Track your agricultural analysis over time</p>
              </div>
            </div>

            {history.length > 0 && (
              <Button onClick={exportHistory} className="bg-gradient-to-r from-purple-500 to-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item, index) => (
                <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>Analysis #{history.length - index}</span>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Turmeric Results */}
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Leaf className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">Crop Disease Status</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700 mb-2">
                          {item.turmeric?.most_likely || "N/A"}
                        </div>
                        <div className="text-sm text-green-600">
                          Confidence:{" "}
                          {item.turmeric?.predictions?.find((p: any) => p.disease === item.turmeric.most_likely)
                            ?.probability
                            ? (
                                item.turmeric.predictions.find((p: any) => p.disease === item.turmeric.most_likely)
                                  .probability * 100
                              ).toFixed(1) + "%"
                            : "N/A"}
                        </div>
                      </div>

                      {/* Bacillus Results */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Microscope className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">Soil Health</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700 mb-2">
                          {item.bacillus?.health_status || "N/A"}
                        </div>
                        <div className="text-sm text-blue-600">
                          Bacteria Count: {item.bacillus?.predicted_count?.toLocaleString() || "N/A"} CFU/g
                        </div>
                      </div>
                    </div>

                    {/* Parameters Summary */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Analysis Parameters</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <span>pH: {item.formData?.soil_pH || "N/A"}</span>
                        <span>Temp: {item.formData?.temperature || "N/A"}°C</span>
                        <span>Rainfall: {item.formData?.rainfall || "N/A"}mm</span>
                        <span>Humidity: {item.formData?.humidity || "N/A"}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No History Available</h3>
                <p className="text-gray-500">
                  Your prediction history will appear here after you make your first analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
