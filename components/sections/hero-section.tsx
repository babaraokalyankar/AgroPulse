"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface HeroSectionProps {
  onGetStarted: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large hexagons */}
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-emerald-400/20 rotate-12 animate-pulse">
          <div className="w-full h-full bg-gradient-to-br from-emerald-400/10 to-teal-400/10 transform rotate-45"></div>
        </div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-teal-400/20 rotate-45 animate-pulse delay-1000">
          <div className="w-full h-full bg-gradient-to-br from-teal-400/10 to-cyan-400/10 transform rotate-12"></div>
        </div>
        <div className="absolute bottom-32 left-40 w-28 h-28 border-2 border-cyan-400/20 rotate-12 animate-pulse delay-500">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 transform rotate-45"></div>
        </div>

        {/* Floating triangles */}
        <div className="absolute top-60 right-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-emerald-400/20 animate-bounce"></div>
        <div className="absolute bottom-60 right-60 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-teal-400/20 animate-bounce delay-700"></div>

        {/* Gradient orbs */}
        <div className="absolute top-32 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-1/3 w-48 h-48 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-700"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t("heroTitle")}
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              {t("heroSubtitle")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("heroDescription")}
          </p>

          <div className="flex justify-center items-center mb-12">
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {t("getStarted")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-emerald-400/20">
              <div className="text-2xl font-bold text-emerald-400 mb-2">{t("aiPowered")}</div>
              <div>{t("aiPoweredDesc")}</div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-teal-400/20">
              <div className="text-2xl font-bold text-teal-400 mb-2">{t("realTime")}</div>
              <div>{t("realTimeDesc")}</div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-cyan-400/20">
              <div className="text-2xl font-bold text-cyan-400 mb-2">{t("accurate")}</div>
              <div>{t("accurateDesc")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
