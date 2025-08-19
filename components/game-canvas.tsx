"use client"

import { useEffect, useRef } from "react"


interface GameCanvasProps {
  multiplier: number
  phase: "betting" | "flying" | "crashed" | "waiting"
  crashed: boolean
  timeLeft:number
}

export function GameCanvas({ multiplier, phase, crashed,timeLeft}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeLeftRef = useRef(timeLeft)

  // keep latest value in ref
  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2,
      )
      bgGradient.addColorStop(0, "rgba(147, 51, 234, 0.1)")
      bgGradient.addColorStop(0.5, "rgba(59, 7, 100, 0.2)")
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.8)")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (phase === "betting") {
        // Enhanced waiting state with pulsing effect
        const time = Date.now() * 0.003
        const alpha = 0.5 + 0.3 * Math.sin(time)

        ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`
        ctx.font = "bold 28px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🚀 Preparing for Launch...", canvas.width / 2, canvas.height / 2 - 20)

        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.8})`
        ctx.font = "16px Arial"
        ctx.fillText("Place your bets now!", canvas.width / 2, canvas.height / 2 + 20)

        ctx.fillStyle = '#ffffff'
        ctx.font = " 14px Arial"
        ctx.strokeText(`Place your bets ${timeLeft}s `, canvas.width / 2, canvas.height / 2 + 60)
        ctx.fillText(`Place your bets ${timeLeft}s `, canvas.width / 2, canvas.height / 2 + 60)
        return
      }

     

      // Enhanced grid with purple theme
      ctx.strokeStyle = "rgba(147, 51, 234, 0.3)"
      ctx.lineWidth = 1
      for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * canvas.width
        const y = (i / 10) * canvas.height

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Calculate enhanced curve points
      const points: [number, number][] = []
      const maxX = canvas.width * 0.85
      const progress = Math.min(multiplier / 15, 1)

      for (let x = 0; x <= maxX * progress; x += 1) {
        const normalizedX = x / maxX
        const curveMultiplier = 1 + (multiplier - 1) * normalizedX
        const y = canvas.height - (Math.log(curveMultiplier) / Math.log(15)) * (canvas.height * 0.7)
        points.push([x, Math.max(y, 30)])
      }

      if (points.length > 1) {
        // Enhanced curve with gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        if (crashed) {
          gradient.addColorStop(0, "#ef4444")
          gradient.addColorStop(1, "#dc2626")
        } else {
          gradient.addColorStop(0, "#10b981")
          gradient.addColorStop(0.5, "#8b5cf6")
          gradient.addColorStop(1, "#a855f7")
        }

        // Draw main curve
        ctx.strokeStyle = gradient
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(points[0][0], points[0][1])

        // Smooth curve using quadratic curves
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i][0] + points[i + 1][0]) / 2
          const yc = (points[i][1] + points[i + 1][1]) / 2
          ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc)
        }
        ctx.stroke()

        // Enhanced glow effect
        ctx.shadowColor = crashed ? "#ef4444" : "#8b5cf6"
        ctx.shadowBlur = 15
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.shadowBlur = 0

        // Fill area under curve
        ctx.globalAlpha = 0.2
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(points[0][0], canvas.height)
        for (const point of points) {
          ctx.lineTo(point[0], point[1])
        }
        ctx.lineTo(points[points.length - 1][0], canvas.height)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1

        // Enhanced rocket with trail effect
        if (!crashed && points.length > 0) {
          const lastPoint = points[points.length - 1]

          // Rocket trail
          ctx.globalAlpha = 0.6
          for (let i = 0; i < 5; i++) {
            const trailIndex = Math.max(0, points.length - 1 - i * 3)
            const trailPoint = points[trailIndex]
            ctx.fillStyle = `rgba(251, 191, 36, ${0.8 - i * 0.15})`
            ctx.beginPath()
            ctx.arc(trailPoint[0], trailPoint[1], 3 - i * 0.5, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalAlpha = 1

          // Main rocket (larger size)
          ctx.font = "60px Arial"
          ctx.textAlign = "center"
          ctx.fillStyle = "#fbbf24"
          ctx.fillText("🚀", lastPoint[0], lastPoint[1] - 10)

          // Rocket glow
          ctx.shadowColor = "#fbbf24"
          ctx.shadowBlur = 15
          ctx.fillText("🚀", lastPoint[0], lastPoint[1] - 10)
          ctx.shadowBlur = 0

        }
      }

      // Enhanced multiplier display
      const multiplierGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      if (crashed) {
        multiplierGradient.addColorStop(0, "#ef4444")
        multiplierGradient.addColorStop(1, "#dc2626")
      } else {
        multiplierGradient.addColorStop(0, "#10b981")
        multiplierGradient.addColorStop(0.5, "#8b5cf6")
        multiplierGradient.addColorStop(1, "#a855f7")
      }

      ctx.fillStyle = multiplierGradient
      ctx.font = "bold 42px Arial"
      ctx.textAlign = "center"
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
      ctx.lineWidth = 2
      ctx.strokeText(`${multiplier.toFixed(2)}×`, canvas.width / 2, 70)
      ctx.fillText(`${multiplier.toFixed(2)}×`, canvas.width / 2, 70)

     if (phase === "waiting" && timeLeft !== undefined) {
      ctx.fillStyle = "#ffffff"
      ctx.font = " 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`Next round in ${timeLeft}s`, canvas.width / 2, canvas.height - 50)
    }

      // Enhanced crash effect
      if (crashed) {
        // Explosion effect
        const time = Date.now() * 0.01
        ctx.globalAlpha = 0.7

        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2
          const distance = 50 + Math.sin(time + i) * 20
          const x = canvas.width / 2 + Math.cos(angle) * distance
          const y = canvas.height / 2 + Math.sin(angle) * distance

          ctx.fillStyle = `hsl(${Math.random() * 60}, 100%, 50%)`
          ctx.beginPath()
          ctx.arc(x, y, Math.random() * 5 + 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1

        // Crash overlay
        ctx.fillStyle = "rgba(239, 68, 68, 0.4)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Crash text with enhanced styling
        ctx.fillStyle = "#ef4444"
        ctx.font = "bold 56px Arial"
        ctx.textAlign = "center"
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"
        ctx.lineWidth = 3
        ctx.strokeText("💥 CRASHED!", canvas.width / 2, canvas.height / 2)
        ctx.fillText("💥 CRASHED!", canvas.width / 2, canvas.height / 2)

        // Crash glow effect
        ctx.shadowColor = "#ef4444"
        ctx.shadowBlur = 20
        ctx.fillText("💥 CRASHED!", canvas.width / 2, canvas.height / 2)
        ctx.shadowBlur = 0
      }
    }

    const animate = () => {
      draw()
      if (phase === "flying" && !crashed) {
        animationRef.current = requestAnimationFrame(animate)
      } else if (phase === "betting") {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [multiplier, phase, crashed,timeLeft])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={482}
        className="w-full h-auto bg-gradient-to-br from-black via-purple-950/50 to-black rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20"
      />
      {/* Decorative border glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 pointer-events-none"></div>
    </div>
  )
}
