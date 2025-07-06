"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TransformSection } from "@/components/transform-section"
import { FeaturesSection } from "@/components/features-section"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <TransformSection />
      <FeaturesSection />
    </>
  )
}
