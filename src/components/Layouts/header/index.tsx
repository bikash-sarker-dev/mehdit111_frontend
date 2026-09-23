"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const USER = {
    name: "John Smith",
    email: "johnson@nextadmin.com",
    img: "/images/user/user-03.png",
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt=""
            role="presentation"
          />
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
          Dashboard
        </h1>
        {/* <p className="font-medium">Next.js Admin Dashboard Solution</p> */}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <Notification />

        <div className="hidden shrink-0 sm:block">
          <figure className="flex items-center gap-2.5 px-5 py-3.5">
            <Image
              src={USER.img}
              className="size-10"
              alt={`Avatar for ${USER.name}`}
              role="presentation"
              width={200}
              height={200}
            />

            <figcaption className="space-y-1 text-sm font-medium sm:text-base">
              <div className="mb-2 leading-none text-dark dark:text-white">
                {USER.name}
              </div>

              <div className="leading-none text-gray-6 sm:text-xs">
                {USER.email}
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
