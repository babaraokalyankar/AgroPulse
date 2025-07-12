"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Smart Agriculture
            <span className="block text-yellow-400">Intelligence</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Revolutionary AI-powered platform for turmeric cultivation. Predict diseases, analyze soil health, and
            optimize your harvest with cutting-edge machine learning.
          </p>

          <div className="flex justify-center items-center mb-12">
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
            <div className="p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-2">AI-Powered</div>
              <div>Advanced machine learning algorithms</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-green-400 mb-2">Real-time</div>
              <div>Instant predictions and recommendations</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-400 mb-2">Accurate</div>
              <div>91%+ prediction accuracy rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
