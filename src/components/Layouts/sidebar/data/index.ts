import * as Icons from "../icons";
import type { NavSection } from "./types";

export const NAV_DATA_USER: NavSection[] = [
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
        url: "/dashboard/review-gap-management",
        items: [],
      },
    ],
  },
];

export const NAV_DATA_DOWN_USER: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Settings",
        icon: Icons.Settings,
        url: "/dashboard/settings",
        items: [],
      },
      {
        title: "Plan & Billing",
        icon: Icons.CreditCard,
        url: "/dashboard/plan-management",
        items: [],
      },
      {
        title: "Help",
        icon: Icons.MessageCircleQuestionMark,
        url: "/dashboard/help-manage",
        items: [],
      },
    ],
  },
];
export const NAV_DATA_ADMIN: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Overview",
        icon: Icons.LayoutDashboard,
        url: "/dashboard/admin",
        items: [],
      },

      {
        title: "User Management",
        url: "/dashboard/admin/user-management",
        icon: Icons.UserRound,
        items: [],
      },
      {
        title: "Subscriptions",
        url: "/dashboard/nfc-management",
        icon: Icons.CreditCard,
        items: [
          {
            title: "Revenue & Billing",
            url: "/dashboard/nfc-management",
            icon: Icons.CircleDollarSign,
          },
          {
            title: "Plans & Pricing",
            url: "/dashboard/nfc-management",
            icon: Icons.Tag,
          },
        ],
      },
    ],
  },
];

export const NAV_DATA_DOWN_ADMIN: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Settings",
        icon: Icons.Settings,
        url: "/dashboard/settings",
        items: [],
      },
    ],
  },
];
