import React, { useEffect, useRef } from "react";

/**
 * BananaBackground Component
 * Casual, calm ambient background with gentle, slow-floating particles
 * and warm, subtle tones that keep the focus on gameplay without distraction.
 */
export default function BananaBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Casual, gentle ambient particles with low opacity
    const items = ["🍌", "✨", "🟡"];
    const particles = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 14 + Math.random() * 10,
      char: items[Math.floor(Math.random() * items.length)],
      speedY: 0.12 + Math.random() * 0.2, // very slow, casual drift
      speedX: (Math.random() - 0.5) * 0.15,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.3, // slow gentle tilt
      opacity: 0.08 + Math.random() * 0.08 // soft, non-distracting
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="banana-background-canvas" />;
}
