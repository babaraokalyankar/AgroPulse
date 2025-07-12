"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Leaf, Microscope } from "lucide-react"
import { generateHistoryPDF } from "@/lib/history-pdf-generator"

interface HistoryTrackerProps {
  onBack: () => void
  history: any[]
}

export default function HistoryTracker({ onBack, history }: HistoryTrackerProps) {
  const exportHistoryPDF = () => {
    generateHistoryPDF(history)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-emerald-900 to-teal-900">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Powder')`,
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
                AgroPulse Platform
              </Button>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">Prediction History</h1>
                <p className="text-gray-300">Track your agricultural analysis over time</p>
              </div>
            </div>

            {history.length > 0 && (
              <Button onClick={exportHistoryPDF} className="bg-gradient-to-r from-purple-500 to-pink-600">
                <Calendar className="w-4 h-4 mr-2" />
                Export History PDF
              </Button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item, index) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>Analysis #{history.length - index}</span>
                      </div>
                      <span className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Turmeric Results */}
                      <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-400/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Leaf className="w-5 h-5 text-emerald-400" />
                          <span className="font-semibold text-emerald-300">Crop Disease Status</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-200 mb-2">
                          {item.turmeric?.most_likely || "N/A"}
                        </div>
                        <div className="text-sm text-emerald-400">
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
                      <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Microscope className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-blue-300">Soil Health</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-200 mb-2">
                          {item.bacillus?.health_status || "N/A"}
                        </div>
                        <div className="text-sm text-blue-400">
                          Bacteria Count: {item.bacillus?.predicted_count?.toLocaleString() || "N/A"} CFU/g
                        </div>
                      </div>
                    </div>

                    {/* Parameters Summary */}
                    <div className="mt-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-2">Analysis Parameters</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <span className="text-gray-300">pH: {item.formData?.soil_pH || "N/A"}</span>
                        <span className="text-gray-300">Temp: {item.formData?.temperature || "N/A"}°C</span>
                        <span className="text-gray-300">Rainfall: {item.formData?.rainfall || "N/A"}mm</span>
                        <span className="text-gray-300">Humidity: {item.formData?.humidity || "N/A"}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No History Available</h3>
                <p className="text-gray-300">
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
