// "use client";

// import { Logo } from "@/components/logo";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import {
//   NAV_DATA_DOWN_USER,
//   NAV_DATA_USER,
//   NAV_DATA_DOWN_ADMIN,
//   NAV_DATA_ADMIN,
// } from "./data";
// import { ArrowLeftIcon, ChevronUp } from "./icons";
// import { LogOut as LogOutIcon } from "lucide-react";
// import { MenuItem } from "./menu-item";
// import { useSidebarContext } from "./sidebar-context";
// import type { NavItem } from "./data/types";

// export function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();

//   const [expandedItems, setExpandedItems] = useState<string[]>([]);

//   let NAV_DATA;
//   let NAV_DATA_DOWN;

//   const role = "Admin";

//   if (role === "Admin") {
//     NAV_DATA = NAV_DATA_ADMIN;
//     NAV_DATA_DOWN = NAV_DATA_DOWN_ADMIN;
//   } else {
//     NAV_DATA = NAV_DATA_USER;
//     NAV_DATA_DOWN = NAV_DATA_DOWN_USER;
//   }

//   /** ⭐ Correct nested URL detection */
//   const isActiveUrl = (url?: string): boolean => {
//     if (!url) return false;
//     return pathname === url || pathname.startsWith(url + "/deshboard");
//   };

//   const toggleExpanded = (title: string) => {
//     setExpandedItems((prev) =>
//       prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
//     );
//   };

//   /** ⭐ Auto-expand if child matches */
//   useEffect(() => {
//     NAV_DATA.forEach((section) =>
//       section.items.forEach((item: NavItem) => {
//         if (item.items.some((sub) => isActiveUrl(sub.url))) {
//           if (!expandedItems.includes(item.title)) {
//             setExpandedItems([item.title]);
//           }
//         }
//       }),
//     );
//   }, [pathname]);

//   const handleLogout = () => {
//     if (isMobile) toggleSidebar();
//     router.push("/signIn");
//   };

//   return (
//     <>
//       {isMobile && isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       <aside
//         className={cn(
//           "max-w-[290px] overflow-hidden border-r bg-white transition-[width] dark:bg-gray-dark",
//           isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
//           isOpen ? "w-full" : "w-0",
//         )}
//       >
//         <div className="flex h-full flex-col py-6 pl-[25px] pr-[7px]">
//           {/* Logo */}
//           <div className="relative pl-10 pr-4.5">
//             <Link
//               href="/"
//               onClick={() => isMobile && toggleSidebar()}
//               className="px-0 py-2.5"
//             >
//               <Logo />
//             </Link>

//             {isMobile && (
//               <button
//                 onClick={toggleSidebar}
//                 className="absolute left-3/4 top-1/2 -translate-y-1/2"
//               >
//                 <ArrowLeftIcon className="size-7" />
//               </button>
//             )}
//           </div>

//           {/* Navigation */}
//           <div className="custom-scrollbar mt-1 flex-1 overflow-y-auto pr-3">
//             {NAV_DATA.map((section) => (
//               <div key={section.label} className="mb-6">
//                 <h2 className="mb-5 text-sm font-medium text-dark-4">
//                   {section.label}
//                 </h2>

//                 <nav>
//                   <ul className="space-y-2">
//                     {section.items.map((item) => {
//                       const hasChildren = item.items.length > 0;
//                       const parentIsActive =
//                         isActiveUrl(item.url) ||
//                         item.items.some((sub) => isActiveUrl(sub.url));

//                       return (
//                         <li key={item.title}>
//                           {hasChildren ? (
//                             <>
//                               <MenuItem
//                                 isActive={parentIsActive}
//                                 onClick={() => toggleExpanded(item.title)}
//                               >
//                                 <item.icon className="size-6" />
//                                 <span>{item.title}</span>
//                                 <ChevronUp
//                                   className={cn(
//                                     "ml-auto rotate-180 transition-transform",
//                                     expandedItems.includes(item.title) &&
//                                       "rotate-0",
//                                   )}
//                                 />
//                               </MenuItem>

//                               {expandedItems.includes(item.title) && (
//                                 <ul className="ml-9 space-y-1.5 pt-2">
//                                   {item.items.map((sub) => (
//                                     <li key={sub.title}>
//                                       <MenuItem
//                                         as="link"
//                                         href={sub.url}
//                                         isActive={isActiveUrl(sub.url)}
//                                       >
//                                         {sub.title}
//                                       </MenuItem>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               )}
//                             </>
//                           ) : (
//                             <MenuItem
//                               as="link"
//                               href={item.url ?? "/"}
//                               isActive={isActiveUrl(item.url)}
//                               className="flex items-center gap-3 py-3"
//                             >
//                               <item.icon className="size-6" />
//                               <span>{item.title}</span>
//                             </MenuItem>
//                           )}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </nav>
//               </div>
//             ))}
//           </div>

//           {/* Logout */}
//           <div className="mt-auto">
//             <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3">
//               {NAV_DATA_DOWN.map((section) => (
//                 <div key={section.label} className="mb-6">
//                   <nav>
//                     <ul className="space-y-1">
//                       {section.items.map((item) => {
//                         const hasChildren = item.items.length > 0;
//                         const parentIsActive =
//                           isActiveUrl(item.url) ||
//                           item.items.some((sub) => isActiveUrl(sub.url));

//                         return (
//                           <li key={item.title}>
//                             {hasChildren ? (
//                               <>
//                                 <MenuItem
//                                   isActive={parentIsActive}
//                                   onClick={() => toggleExpanded(item.title)}
//                                 >
//                                   <item.icon className="size-6" />
//                                   <span>{item.title}</span>
//                                   <ChevronUp
//                                     className={cn(
//                                       "ml-auto rotate-180 transition-transform",
//                                       expandedItems.includes(item.title) &&
//                                         "rotate-0",
//                                     )}
//                                   />
//                                 </MenuItem>

//                                 {expandedItems.includes(item.title) && (
//                                   <ul className="ml-9 space-y-1.5 pt-2">
//                                     {item.items.map((sub) => (
//                                       <li key={sub.title}>
//                                         <MenuItem
//                                           as="link"
//                                           href={sub.url}
//                                           isActive={isActiveUrl(sub.url)}
//                                         >
//                                           {sub.title}
//                                         </MenuItem>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 )}
//                               </>
//                             ) : (
//                               <MenuItem
//                                 as="link"
//                                 href={item.url ?? "/"}
//                                 isActive={isActiveUrl(item.url)}
//                                 className="flex items-center gap-3 py-3"
//                               >
//                                 <item.icon className="size-6" />
//                                 <span>{item.title}</span>
//                               </MenuItem>
//                             )}
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </nav>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex w-full items-center gap-3 rounded-xl bg-red-100 px-4 py-3 text-red-600 hover:bg-red-200"
//             >
//               <LogOutIcon className="size-6" />
//               <span className="font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }
"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NAV_DATA_DOWN_USER,
  NAV_DATA_USER,
  NAV_DATA_DOWN_ADMIN,
  NAV_DATA_ADMIN,
} from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { LogOut as LogOutIcon } from "lucide-react";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import type { NavItem } from "./data/types";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  let NAV_DATA;
  let NAV_DATA_DOWN;

  const role = "Admin";

  if (role === "Admin") {
    NAV_DATA = NAV_DATA_ADMIN;
    NAV_DATA_DOWN = NAV_DATA_DOWN_ADMIN;
  } else {
    NAV_DATA = NAV_DATA_USER;
    NAV_DATA_DOWN = NAV_DATA_DOWN_USER;
  }

  /**
   * Nested URL detection.
   * NOTE: the old version used `url + "/deshboard"`, which only matched
   * URLs ending in "/deshboard". `url + "/"` matches any child route.
   */
  const isActiveUrl = (url?: string): boolean => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  /** Auto-expand if a child matches the current route */
  useEffect(() => {
    NAV_DATA.forEach((section) =>
      section.items.forEach((item: NavItem) => {
        if (item.items.some((sub) => isActiveUrl(sub.url))) {
          setExpandedItems((prev) =>
            prev.includes(item.title) ? prev : [...prev, item.title],
          );
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    if (isMobile) toggleSidebar();
    router.push("/signIn");
  };

  /** Shared renderer for the top and bottom nav lists */
  const renderNavItems = (items: NavItem[], listSpacing: string) => (
    <nav>
      <ul className={listSpacing}>
        {items.map((item) => {
          const hasChildren = item.items.length > 0;
          const parentIsActive =
            isActiveUrl(item.url) ||
            item.items.some((sub) => isActiveUrl(sub.url));

          return (
            <li key={item.title}>
              {hasChildren ? (
                <>
                  <MenuItem
                    isActive={parentIsActive}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <item.icon className="size-6" />
                    <span>{item.title}</span>
                    <ChevronUp
                      className={cn(
                        "ml-auto rotate-180 transition-transform",
                        expandedItems.includes(item.title) && "rotate-0",
                      )}
                    />
                  </MenuItem>

                  {expandedItems.includes(item.title) && (
                    <ul className="ml-4 space-y-1.5 pt-2">
                      {item.items.map((sub) => (
                        <li key={sub.title}>
                          <MenuItem
                            as="link"
                            href={sub.url}
                            isActive={isActiveUrl(sub.url)}
                          >
                            {/* Submenu icon */}
                            <sub.icon className="size-5 shrink-0" />
                            <span>{sub.title}</span>
                          </MenuItem>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <MenuItem
                  as="link"
                  href={item.url ?? "/"}
                  isActive={isActiveUrl(item.url)}
                  className="py-3"
                >
                  <item.icon className="size-6 shrink-0" />
                  <span>{item.title}</span>
                </MenuItem>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r bg-white transition-[width] dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
      >
        <div className="flex h-full flex-col py-6 pl-[25px] pr-[7px]">
          {/* Logo */}
          <div className="relative pl-10 pr-4.5">
            <Link
              href="/"
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 top-1/2 -translate-y-1/2"
              >
                <ArrowLeftIcon className="size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-1 flex-1 overflow-y-auto pr-3">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4">
                  {section.label}
                </h2>
                {renderNavItems(section.items, "space-y-2")}
              </div>
            ))}
          </div>

          {/* Bottom section + Logout */}
          <div className="mt-auto">
            <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3">
              {NAV_DATA_DOWN.map((section) => (
                <div key={section.label} className="mb-6">
                  {renderNavItems(section.items, "space-y-1")}
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-red-100 px-4 py-3 text-red-600 hover:bg-red-200"
            >
              <LogOutIcon className="size-6" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
