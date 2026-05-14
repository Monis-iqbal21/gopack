import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const styles = clsx(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all",
    variant === "primary" &&
      "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20",
    variant === "secondary" &&
      "bg-white text-zinc-950 hover:bg-zinc-100",
    variant === "outline" &&
      "border border-zinc-700 text-zinc-100 hover:bg-zinc-900",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}