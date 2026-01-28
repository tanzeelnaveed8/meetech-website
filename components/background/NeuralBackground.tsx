"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
    ctxRef.current = ctx;

    let animationFrameId = 0;
    let particles: Particle[] = [];

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      particles = Array.from({ length: 65 }, () => new Particle());
    };

    const draw = () => {
      const ctx = ctxRef.current!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = getThemeColors();

      particles.forEach((p, i) => {
        p.update();

        // nodes
        ctx.fillStyle =
          i % 8 === 0 ? colors.accent : `${colors.muted}cc`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < 200) {
            const alpha = Math.floor(
              (1 - dist / 200) * 45
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

        // mouse interaction
        const mDist = Math.hypot(
          p.x - mouse.current.x,
          p.y - mouse.current.y
        );

        if (mDist < 300) {
          const mAlpha = Math.floor(
            (1 - mDist / 300) * 70
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
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-90"
    />
  );
};

export default NeuralBackground;
