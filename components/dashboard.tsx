"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface DashboardProps {
  onBack: () => void
  history: any[]
}

export default function Dashboard({ onBack, history }: DashboardProps) {
  const getRecentTrends = () => {
    if (history.length === 0) return null

    const diseaseStatuses = history.map((h) => h.turmeric?.most_likely).filter(Boolean)
    const bacteriaCounts = history.map((h) => h.bacillus?.predicted_count).filter(Boolean)

    const healthyCount = diseaseStatuses.filter((s) => s === "None").length
    const avgBacteriaCount = bacteriaCounts.reduce((a, b) => a + b, 0) / bacteriaCounts.length || 0

    return {
      healthyPercentage: (healthyCount / diseaseStatuses.length) * 100,
      avgBacteriaCount,
      totalAnalyses: history.length,
    }
  }

  const trends = getRecentTrends()

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Processing')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-white/80">Comprehensive insights from your agricultural data</p>
            </div>
          </div>

          {trends ? (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Healthy Crops</p>
                        <p className="text-3xl font-bold text-green-600">{trends.healthyPercentage.toFixed(1)}%</p>
                      </div>
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg. Bacteria Count</p>
                        <p className="text-3xl font-bold text-blue-600">{trends.avgBacteriaCount.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Analyses</p>
                        <p className="text-3xl font-bold text-purple-600">{trends.totalAnalyses}</p>
                      </div>
                      <AlertTriangle className="w-12 h-12 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Predictions */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {history.slice(0, 5).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</div>
                          <div className="font-medium">Disease: {item.turmeric?.most_likely || "N/A"}</div>
                          <div className="text-sm text-gray-600">
                            Bacteria: {item.bacillus?.predicted_count?.toLocaleString() || "N/A"} CFU/g
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
                <p className="text-gray-500">Start making predictions to see your analytics dashboard</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
