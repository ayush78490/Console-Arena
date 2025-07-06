"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { UploadCloud, ArrowRight } from "lucide-react"
import { useUser } from "@clerk/nextjs"

type FormData = {
  title: string
  description: string
  gameUrl: string
  imageUrl: string
  category: string
}

export function PublishGame() {
  const router = useRouter()
  const { isLoaded, user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    gameUrl: "",
    imageUrl: "",
    category: "arcade"
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Game title is required"
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    if (!formData.gameUrl.trim()) {
      newErrors.gameUrl = "Game URL is required"
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL"
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded) {
      toast({
        title: "System is loading",
        description: "Please wait while we verify your session",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/games/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          gameUrl: formData.gameUrl.trim(),
          imageUrl: formData.imageUrl.trim() || "/images/default-game.png",
          category: formData.category,
          authorId: user?.id,
          authorName: user?.fullName || "Anonymous",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to publish game")
      }

      toast({
        title: "Success!",
        description: "Your game has been published successfully",
        variant: "default",
      })

      setFormData({
        title: "",
        description: "",
        gameUrl: "",
        imageUrl: "",
        category: "arcade"
      })

      setTimeout(() => router.push("/games"), 1500)

    } catch (error) {
      console.error("Publish error:", error)
      toast({
        title: "Publishing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPublishDisabled = 
    isSubmitting || 
    !isLoaded || 
    !formData.title.trim() || 
    !formData.gameUrl.trim()

  return (
    <div className="min-h-screen bg-gray-950 py-12 relative overflow-hidden">
      {/* Sci-fi background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-64 bg-purple-500 rounded-full filter blur-[120px] opacity-10"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sci-fi polygon container with neon glow */}
        <div className="relative">
          {/* Neon border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition duration-300"></div>
          
          {/* Main container */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
            {/* Header with sci-fi accent */}
            <div className="p-6 border-b border-gray-800 relative">
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-transparent"></div>
              <div className="flex items-center gap-3">
                <UploadCloud className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  <span className="text-transparent font-pixel bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    PUBLISH YOUR GAME
                  </span>
                </h2>
              </div>
              <p className="text-gray-400 font-pixel text-sm mt-1">
                Share your creation with the galaxy
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300 font-pixel">
                    GAME TITLE *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter game title"
                    className="bg-gray-800/50 border-gray-700 text-white font-pixel placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs font-pixel">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gameUrl" className="text-gray-300 font-pixel">
                    GAME URL *
                  </Label>
                  <Input
                    id="gameUrl"
                    name="gameUrl"
                    type="url"
                    value={formData.gameUrl}
                    onChange={handleChange}
                    placeholder="https://your-game.com"
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  {errors.gameUrl && (
                    <p className="text-red-400 text-xs">{errors.gameUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-gray-300">
                    THUMBNAIL URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/game-thumbnail.jpg"
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  {errors.imageUrl && (
                    <p className="text-red-400 text-xs">{errors.imageUrl}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    Leave blank to use default image
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300 font-pixel">
                    CATEGORY *
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-gray-800/50 border border-gray-700 text-white rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="arcade">Arcade</option>
                    <option value="strategy">Strategy</option>
                    <option value="rpg">RPG</option>
                    <option value="casual">Casual</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300 font-pixel">
                    DESCRIPTION
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell the galaxy about your game..."
                    className="bg-gray-800/50 border-gray-700 text-white font-pixel placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs font-pixel">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs font-pixel">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isPublishDisabled}
                    className={`w-full text-white transition-all duration-300 ${
                      isPublishDisabled 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        INITIATING PUBLISH SEQUENCE...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        LAUNCH GAME <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 font-pixel text-sm">
          <p>By publishing, you agree to the intergalactic terms of service.</p>
          <p>Ensure you have the necessary cosmic rights to share this content.</p>
        </div>
      </div>
    </div>
  )
}