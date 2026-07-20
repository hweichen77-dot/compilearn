import React from "react";
import { cn } from "@/lib/utils";

export function Marquee({ children, reverse = false, speed = 30, className }) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        "[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]",
        className
      )}
    >
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
          className="flex shrink-0 items-center gap-6 pr-6 [animation-name:kit-marquee] [animation-timing-function:linear] [animation-iteration-count:infinite] group-hover:[animation-play-state:paused]"
        >
          {children}
        </div>
      ))}
    </div>
  );
}
