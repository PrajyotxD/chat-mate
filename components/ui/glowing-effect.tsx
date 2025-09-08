"use client";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingEffect({ 
  children, 
  className,
  glowColor = "rgb(34, 197, 94)" 
}: GlowingEffectProps) {
  return (
    <div 
      className={cn(
        "relative group",
        className
      )}
      style={{
        filter: `drop-shadow(0 0 20px ${glowColor}40)`,
      }}
    >
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
