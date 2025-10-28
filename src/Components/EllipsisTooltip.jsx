import React, { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/Components/ui/Tooltip";
import { cn } from "@/lib/utils";

const EllipsisTooltip = ({ children, className }) => {
  const textRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflow(el.scrollWidth > el.clientWidth);
    }
  }, [children]);

  return (
    <TooltipProvider delayDuration={0}>
      {isOverflow ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              ref={textRef}
              className={cn(`truncate overflow-hidden whitespace-nowrap min-w-0 `, className)}
            >
              {children}
            </p>
          </TooltipTrigger>
          <TooltipContent
            className="px-2 py-1 text-xs max-w-xs break-words whitespace-normal"
          >
            {children}
          </TooltipContent>
        </Tooltip>
      ) : (
        <p
          ref={textRef}
          className={cn(`truncate overflow-hidden whitespace-nowrap min-w-0 `, className)}
        >
          {children}
        </p>
      )}
    </TooltipProvider>
  );
};

export default EllipsisTooltip;
