import React from "react";
import { cn } from "@/src/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverEffect = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "glass-card p-6",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
