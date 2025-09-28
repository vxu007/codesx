"use client";

import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const AnimatedCircularProgressBar = ({
  value,
  gaugePrimaryColor,
  gaugeSecondaryColor,
}: {
  value: number;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
}) => {
  const progress = useMotionValue(0);
  const displayValue = useTransform(progress, (v) => Math.round(v * 100));

  const pathLength = useSpring(progress, {
    damping: 20,
    stiffness: 100,
  });

  useEffect(() => {
    animate(progress, value / 100, {
      duration: 1.5,
      ease: "easeInOut",
    });
  }, [value, progress]);

  return (
    <div className="relative h-24 w-24">
      <motion.svg
        animate={{ rotate: 270 }}
        className="absolute left-0 top-0 h-full w-full"
        height="100"
        viewBox="0 0 100 100"
        width="100"
      >
        <motion.circle
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke={gaugeSecondaryColor}
          strokeWidth="5"
        />
        <motion.circle
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke={gaugePrimaryColor}
          strokeDasharray="282.6"
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeWidth="5"
          style={{ pathLength }}
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span className="text-2xl font-medium text-gray-700 dark:text-gray-200">
          {displayValue}
        </motion.span>
        <span className="text-2xl font-medium text-gray-700 dark:text-gray-200">%</span>
      </div>
    </div>
  );
};