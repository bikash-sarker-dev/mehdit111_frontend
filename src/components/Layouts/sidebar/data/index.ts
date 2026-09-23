import * as Icons from "../icons";
import type { NavSection } from "./types";

export const NAV_DATA: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Overview",
        icon: Icons.LayoutDashboard,
        url: "/dashboard",
        items: [],
      },

      {
        title: "Customers",
        url: "/dashboard/customers-management",
        icon: Icons.UserRound,
        items: [],
      },
      {
        title: "NFC",
        url: "/dashboard/nfc-management",
        icon: Icons.Nfc,
        items: [],
      },
      {
        title: "Competitor Intelligence",
        url: "/dashboard/competitor-intelligence",
        icon: Icons.Cog,
        items: [],
      },
      {
        title: "Review Gap",
        icon: Icons.UserStar,
        url: "/notifications",
        items: [],
      },
    ],
  },
];

export const NAV_DATA_DOWN: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Settings",
        icon: Icons.Settings,
        url: "/settings",
        items: [],
      },
      {
        title: "Plan & Billing",
        icon: Icons.CreditCard,
        url: "/settings",
        items: [],
      },
      {
        title: "Help",
        icon: Icons.MessageCircleQuestionMark,
        url: "/settings",
        items: [],
      },
    ],
  },
];
