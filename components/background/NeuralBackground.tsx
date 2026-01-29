"use client";

import { useEffect, useRef, useState } from "react";

type ParticleType = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShouldRender(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    ctxRef.current = ctx;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let lastMouseMove = 0;

    const getThemeColors = () => {
      if (typeof window === "undefined") {
        return { accent: "#2563eb", muted: "#94a3b8" };
      }
      const styles = getComputedStyle(document.documentElement);
      return {
        accent: styles.getPropertyValue("--accent-primary").trim() || "#2563eb",
        muted: styles.getPropertyValue("--text-muted").trim() || "#94a3b8",
      };
    };

    const resize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
    };

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 3 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }
    }

    const init = () => {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 20 : 30; // Reduced from 35/50
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const draw = () => {
      const ctx = ctxRef.current!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = getThemeColors();
      const now = Date.now();
      const enableMouseInteraction = now - lastMouseMove < 3000; // Only show mouse lines for 3s after movement

      particles.forEach((p, i) => {
        p.update();

        // nodes
        ctx.fillStyle =
          i % 8 === 0 ? colors.accent : `${colors.muted}cc`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // links - reduced distance from 200 to 150 for fewer connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = Math.floor(
              (1 - dist / 150) * 45
            )
              .toString(16)
              .padStart(2, "0");

            ctx.strokeStyle = `${colors.muted}${alpha}`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // mouse interaction - only when mouse recently moved
        if (enableMouseInteraction) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const mDist = Math.sqrt(dx * dx + dy * dy);

          if (mDist < 250) {
            const mAlpha = Math.floor(
              (1 - mDist / 250) * 70
            )
              .toString(16)
              .padStart(2, "0");

            ctx.strokeStyle = `${colors.accent}${mAlpha}`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      lastMouseMove = Date.now();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    resize();
    init();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return shouldRender ? (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-90"
    />
  ) : null;
};

export default NeuralBackground;
