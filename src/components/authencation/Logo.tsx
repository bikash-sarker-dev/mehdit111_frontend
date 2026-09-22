import Image from "next/image";

interface LogoProps {
  className?: string;
  /** Pixel width to render at — height scales automatically (logo is ~1.97:1). */
  width?: number;
  priority?: boolean;
}

export default function Logo({
  className = "",
  width = 220,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/images/logo/logo.png"
      alt="Grow More Reviews — Grow More Reviews, Outgrow Your Competition"
      width={459}
      height={200}
      priority={priority}
      style={{ width, height: "auto" }}
      className={className}
    />
  );
}
