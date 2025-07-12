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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Processing')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-300">Comprehensive insights from your agricultural data</p>
            </div>
          </div>

          {trends ? (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300">Healthy Crops</p>
                        <p className="text-3xl font-bold text-emerald-400">{trends.healthyPercentage.toFixed(1)}%</p>
                      </div>
                      <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300">Avg. Bacteria Count</p>
                        <p className="text-3xl font-bold text-blue-400">{trends.avgBacteriaCount.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300">Total Analyses</p>
                        <p className="text-3xl font-bold text-purple-400">{trends.totalAnalyses}</p>
                      </div>
                      <AlertTriangle className="w-12 h-12 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Predictions */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {history.slice(0, 5).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</div>
                          <div className="font-medium text-white">Disease: {item.turmeric?.most_likely || "N/A"}</div>
                          <div className="text-sm text-gray-300">
                            Bacteria: {item.bacillus?.predicted_count?.toLocaleString() || "N/A"} CFU/g
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
                <p className="text-gray-300">Start making predictions to see your analytics dashboard</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
