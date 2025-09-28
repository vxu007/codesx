"use client"

import { animate, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { AnimatedCircularProgressBar } from "@/registry/magicui/animated-circular-progress-bar";

export function AnimatedCircularProgressBarDemo() {
  const progress = useMotionValue(0);

  useEffect(() => {
    const animation = animate(progress, 100, {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => {
      animation.stop();
    };
  }, [progress]);

  return (
    <AnimatedCircularProgressBar
      value={progress.get()}
      gaugePrimaryColor="rgb(79 70 229)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
    />
  );
}