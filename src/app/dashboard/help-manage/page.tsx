import React from "react";
import type { Metadata } from "next";
import HelpSupport from "@/components/dashboardComponents/help/HelpSupport";

export const metadata: Metadata = {
  title: {
    absolute: "GrowMoreReviews",
  },
  description: "Get technical support, customer assistance, or find office details.",
};

export default function HelpManagePage() {
  return <HelpSupport />;
}
