import type { ReactNode } from "react";

type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

export function MaterialIcon({
  name,
  className = "",
  filled = false,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "filled" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] ${className}`.trim()}
    >
      {children}
    </div>
  );
}
