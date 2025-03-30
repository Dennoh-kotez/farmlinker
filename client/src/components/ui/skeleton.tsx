import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "rounded" | "circular" | "text";
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "default",
  animate = true,
  ...props
}: SkeletonProps) {
  // Variant classes
  const variantClasses = {
    default: "h-4 w-full",
    rounded: "h-4 w-full rounded-full",
    circular: "rounded-full",
    text: "h-4 w-3/4",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        variantClasses[variant],
        animate ? "animate-pulse" : "",
        className
      )}
      {...props}
    />
  );
}

// Specialized skeletons
export function TextSkeleton({ lines = 1, className = "" }) {
  return (
    <div className="space-y-2">
      {Array(lines)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            className={cn("h-4", className, index === lines - 1 ? "w-1/2" : "w-3/4")}
          />
        ))}
    </div>
  );
}

export function AvatarSkeleton({ size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return <Skeleton variant="circular" className={sizeClasses[size as keyof typeof sizeClasses]} />;
}

export function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-40 w-full rounded-md" />
        <TextSkeleton lines={2} />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-40 w-full rounded-md" />
        <TextSkeleton lines={1} className="h-5 mt-2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <TextSkeleton lines={1} className="h-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-12 w-12 rounded-md" />
          <TextSkeleton lines={2} />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function OrderGridSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <Skeleton 
            key={index} 
            className={`h-4 ${index === 0 ? "w-1/6" : index === columns - 1 ? "w-1/12" : "w-1/4"}`}
          />
        ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3 border rounded-md p-4">
      <div className="flex items-center space-x-4 py-2 border-b-2">
        {Array(columns)
          .fill(0)
          .map((_, index) => (
            <Skeleton 
              key={index} 
              className={`h-5 ${index === 0 ? "w-1/6" : index === columns - 1 ? "w-1/12" : "w-1/4"}`}
            />
          ))}
      </div>
      <div className="space-y-2">
        {Array(rows)
          .fill(0)
          .map((_, index) => (
            <TableRowSkeleton key={index} columns={columns} />
          ))}
      </div>
    </div>
  );
}