import { cn } from "@/lib/utils";
import { LAYOUT_CONSTANTS } from "@/lib/layout-constants";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "dashboard" | "content";
}

export const ContentContainer = ({ 
  children, 
  className,
  maxWidth = "content" 
}: ContentContainerProps) => {
  return (
    <div className={cn(
      LAYOUT_CONSTANTS.padding.content,
      LAYOUT_CONSTANTS.maxWidth[maxWidth],
      "mx-auto",
      className
    )}>
      {children}
    </div>
  );
};
