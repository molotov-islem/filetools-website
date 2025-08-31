import { AnimatedButton } from "@/components/ui/animated-button"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { ArrowRight, Zap, Shield, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-screen">
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://my.spline.design/celestialflowabstractdigitalform-ilZcPWTn14AB7KguagbiHp6g/"
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full object-cover border-0"
          style={{
            pointerEvents: "none",
            transform: "scale(1.5)",
            transformOrigin: "center center",
          }}
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <ScrollReveal direction="fade" className="mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-balance drop-shadow-lg">
              All-in-one File Tools. <span className="text-[#04afea] animate-pulse">Fast.</span>{" "}
              <span className="text-[#00efd1]">Free.</span> <span className="text-white">Online.</span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal direction="up" delay={200} className="mb-12">
            <p className="text-xl md:text-2xl text-white/90 text-pretty max-w-2xl mx-auto drop-shadow-md">
              Convert, Compress & Manage files in seconds. No downloads, no sign-ups, just results.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal direction="up" delay={400} className="mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                size="lg"
                glow
                ripple
                className="text-lg px-8 py-6 group bg-gradient-primary hover:opacity-90"
              >
                Start Converting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                size="lg"
                glow
                className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Browse Tools
              </AnimatedButton>
            </div>
          </ScrollReveal>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Process files in seconds with our optimized algorithms",
                color: "primary",
              },
              {
                icon: Shield,
                title: "100% Secure",
                desc: "Your files are processed locally and never stored",
                color: "secondary",
              },
              {
                icon: Clock,
                title: "Always Available",
                desc: "Access your tools 24/7 from any device",
                color: "primary",
              },
            ].map((feature, index) => (
              <ScrollReveal key={index} direction="up" delay={600 + index * 100}>
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  <div
                    className={`h-12 w-12 rounded-full ${feature.color === "primary" ? "bg-primary/20 group-hover:bg-primary/30" : "bg-secondary/20 group-hover:bg-secondary/30"} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20`}
                  >
                    <feature.icon className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-[#00efd1] transition-colors drop-shadow-md">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/80 drop-shadow-sm">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
