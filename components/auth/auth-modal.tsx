"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
  onModeChange: (mode: "login" | "signup") => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const { t } = useLanguage()
  const { login, signup, isLoading } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      const success = await signup(formData.name, formData.email, formData.password)
      if (success) {
        onClose()
        setFormData({ name: "", email: "", password: "", confirmPassword: "" })
      } else {
        setError("Signup failed. Please try again.")
      }
    } else {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      const success = await login(formData.email, formData.password)
      if (success) {
        onClose()
        setFormData({ name: "", email: "", password: "", confirmPassword: "" })
      } else {
        setError("Invalid email or password")
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="relative">
          <Button variant="ghost" onClick={onClose} className="absolute right-2 top-2 text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-white">
            {mode === "login" ? t("welcomeBack") : t("createAccount")}
          </CardTitle>
          <p className="text-center text-gray-300 text-sm">{mode === "login" ? t("signInDesc") : t("joinDesc")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  {t("fullName")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("fullName")}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                {t("email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email")}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                {t("password")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("confirmPassword")}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : mode === "login" ? (
                t("signIn")
              ) : (
                t("createAccount")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              {mode === "login" ? t("dontHaveAccount") : t("alreadyHaveAccount")}
              <Button
                variant="link"
                onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
                className="text-emerald-400 hover:text-emerald-300 p-0 ml-1"
              >
                {mode === "login" ? t("signup") : t("signIn")}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
