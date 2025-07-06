import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-[300px] bg-gradient-to-br from-black to-[#242424] transition-all duration-200",
      "text-white relative overflow-hidden group",
      "[clip-path:polygon(0_0,200px_0,210px_10px,280px_10px,290px_0,100%_0,100%_150px,290px_160px,290px_300px,100%_310px,100%_calc(100%-30px),calc(100%-30px)_100%,0_100%,0_400px,10px_390px,10px_100px,0_90px)]",
      "shadow-[0_0_15px_-3px_rgba(110,231,183,0.3)] hover:shadow-[0_0_20px_-3px_rgba(110,231,183,0.5)]", // Neon glow effect
      "border border-green-300/30 hover:border-green-500/50", // Border glow
      "hover:scale-105 transition-all duration-300 ease-in-out",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold text-center",
      "text-green-300 group-hover:text-green-500 transition-colors duration-300", // Neon text that changes on hover
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-green-300/80 group-hover:text-green-500/90 transition-colors duration-300", // Neon description
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "px-6 pb-6 text-green-300/70 group-hover:text-green-500/80 transition-colors duration-300", // Neon content
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center p-6",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "shadow-[0_0_15px_0_rgba(110,231,183,0.4)] group-hover:shadow-[0_0_20px_2px_rgba(110,231,183,0.6)] transition-all duration-300", // Neon glow for image
      className
    )}
    {...props}
  />
))
CardImage.displayName = "CardImage"

const CardButtonContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "shadow-[0_0_10px_0_rgba(110,231,183,0.3)] group-hover:shadow-[0_0_15px_0_rgba(110,231,183,0.5)] transition-all duration-300", // Neon glow for button container
      className
    )}
    {...props}
  />
))
CardButtonContainer.displayName = "CardButtonContainer"

const CardButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-full py-2.5 text-center font-semibold",
      "bg-gradient-to-r from-green-300 to-green-500 text-black",
      "hover:from-green-400 hover:to-green-600 hover:text-white transition-all duration-300",
      "[clip-path:polygon(0_0,100%_0%,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]",
      "border border-green-300/50 hover:border-green-500/70", // Neon border
      "shadow-[inset_0_0_10px_0_rgba(110,231,183,0.3)] hover:shadow-[inset_0_0_15px_0_rgba(110,231,183,0.5)]", // Inner glow
      className
    )}
    {...props}
  />
))
CardButton.displayName = "CardButton"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardImage,
  CardButtonContainer,
  CardButton
}