import Image from "next/image";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import StatBadge from "./StatBadge";

interface AuthLayoutProps {
  children: ReactNode;
  /**
   * Path to the hero photo. Add your own image to /public (e.g.
   * /public/auth-hero.jpg) and point this at it — no photo ships with
   * this component.
   */
  imageSrc?: string;
  headline?: string;
  subtext?: string;
}

export default function AuthLayout({
  children,
  imageSrc = "/images/auth/auth-hero.jpg",
  headline = "Build your online reputation with smarter review growth.",
  subtext = "Grow More Review helps local business get more reviews, improve their online reputation and grow faster.",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left — hero image panel, hidden below lg */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src={imageSrc}
          alt="Business owner sharing a review QR code with a customer"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <h1 className="max-w-md text-3xl font-bold leading-tight text-white xl:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
            {subtext}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatBadge
              icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
              value="4.7"
              label="Google Rating"
            />
            <StatBadge
              icon={<MessageSquare className="h-4 w-4 text-green-500" />}
              value="+25"
              label="New Reviews This Month"
            />
            <StatBadge
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              value="+18%"
              label="Review Growth"
            />
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
