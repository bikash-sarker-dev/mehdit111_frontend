import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Sebady",
    template: "%s | Accounts",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}
