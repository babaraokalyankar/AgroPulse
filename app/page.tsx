"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Microscope, TrendingUp, Shield, BarChart3, Download, User, LogIn, UserPlus, Camera } from "lucide-react"
import HeroSection from "@/components/sections/hero-section"
import UnifiedPredictor from "@/components/prediction/unified-predictor"
import Dashboard from "@/components/dashboard/dashboard"
import HistoryTracker from "@/components/history/history-tracker"
import AuthModal from "@/components/auth/auth-modal"
import ImageAnalysis from "@/components/image-analysis"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "predict" | "dashboard" | "history" | "image-analysis">(
    "home",
  )
  const [predictionHistory, setPredictionHistory] = useState<any[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const addToHistory = (prediction: any) => {
    setPredictionHistory((prev) => [
      {
        ...prediction,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      },
      ...prev.slice(0, 9), // Keep last 10 predictions
    ])
  }

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-emerald-400" />,
      title: "Disease Prediction",
      description: "AI-powered crop disease detection with 91% accuracy",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-900/30",
      borderColor: "border-emerald-500/30",
    },
    {
      icon: <Microscope className="w-8 h-8 text-blue-400" />,
      title: "Soil Analysis",
      description: "Advanced soil bacteria count prediction using LSTM models",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-500/30",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      title: "Growth Optimization",
      description: "Real-time recommendations for optimal crop growth",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-900/30",
      borderColor: "border-purple-500/30",
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-400" />,
      title: "Preventive Care",
      description: "Early warning system for potential crop issues",
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-900/30",
      borderColor: "border-orange-500/30",
    },
  ]

  if (currentView === "predict") {
    return <UnifiedPredictor onBack={() => setCurrentView("home")} onPrediction={addToHistory} />
  }

  if (currentView === "dashboard") {
    return <Dashboard onBack={() => setCurrentView("home")} history={predictionHistory} />
  }

  if (currentView === "history") {
    return <HistoryTracker onBack={() => setCurrentView("home")} history={predictionHistory} />
  }

  if (currentView === "image-analysis") {
    return <ImageAnalysis onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=Turmeric+Plants')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Navigation Header */}
      <nav className="relative z-20 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AgroPulse</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => handleAuthClick("login")} className="text-white hover:bg-white/10">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAuthClick("signup")}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        <HeroSection onGetStarted={() => setCurrentView("predict")} />

        {/* Quick Actions - Moved to middle */}
        <section className="py-16 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Quick Actions</h2>
              <p className="text-xl text-emerald-100">Access powerful tools for your agricultural needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Button
                onClick={() => setCurrentView("predict")}
                className="h-20 text-lg bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                <Leaf className="w-6 h-6 mr-3" />
                Start Prediction
              </Button>

              <Button
                onClick={() => setCurrentView("dashboard")}
                className="h-20 text-lg bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                <BarChart3 className="w-6 h-6 mr-3" />
                View Dashboard
              </Button>

              <Button
                onClick={() => setCurrentView("history")}
                className="h-20 text-lg bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                <Download className="w-6 h-6 mr-3" />
                Prediction History
              </Button>

              <Button
                onClick={() => setCurrentView("image-analysis")}
                className="h-20 text-lg bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                <Camera className="w-6 h-6 mr-3" />
                Image Analysis
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-r from-slate-800/90 to-gray-900/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Advanced Agricultural Intelligence</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Harness the power of machine learning to optimize your turmeric cultivation with precision agriculture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border ${feature.borderColor} ${feature.bgColor} backdrop-blur-lg hover:scale-105`}
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`mb-6 flex justify-center p-4 rounded-full bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
