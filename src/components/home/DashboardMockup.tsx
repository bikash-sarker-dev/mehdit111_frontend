// import Image from "next/image";

// interface DashboardMockupProps {
//   className?: string;
// }

// export default function DashboardMockup({
//   className = "",
// }: DashboardMockupProps) {
//   return (
//     <div className={`relative w-full ${className}`}>
//       <Image
//         src="/images/hero/hero_dashboard.png"
//         alt="Review Growth AI dashboard showing 148 Google reviews, 284 review requests sent this month, 63 NFC taps, and a +18 review gap versus competitors"
//         width={1064}
//         height={489}
//         priority
//         sizes="(min-width: 1024px) 640px, 100vw"
//         className="h-auto w-full drop-shadow-xl"
//       />
//     </div>
//   );
// }
import Image from "next/image";

interface DashboardMockupProps {
  className?: string;
}

export default function DashboardMockup({
  className = "",
}: DashboardMockupProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src="/images/hero/hero_dashboard.png"
        alt="Review Growth AI dashboard showing 148 Google reviews, 284 review requests sent this month, 63 NFC taps, and a +18 review gap versus competitors"
        width={1064}
        height={489}
        priority
        sizes="(min-width: 1024px) 640px, 100vw"
        className="h-auto w-full drop-shadow-xl"
      />
    </div>
  );
}
