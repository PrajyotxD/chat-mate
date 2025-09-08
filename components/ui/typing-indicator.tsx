"use client";
import { motion } from "framer-motion";

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-4">
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
    </div>
  );
};
