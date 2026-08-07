import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  maxWidth?: "7xl" | "5xl";
  className?: string;
};

export function PageContainer({
  children,
  maxWidth = "7xl",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 pb-16 sm:px-6",
        maxWidth === "5xl" ? "max-w-5xl" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
