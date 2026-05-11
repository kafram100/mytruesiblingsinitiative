"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Menu, X } from "lucide-react";

import BrandLogoImage, {
  BRAND_LOGO_CLASS,
} from "@/components/BrandLogoImage";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavChild = { id: string; label: string; href: string };

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

/** Homepage sections opened from Impact menu (Home should not steal active state here). */
const IMPACT_HOME_HASHES = new Set([
  "#promises",
  "#how-it-works",
  "#matching",
  "#testimonials",
]);

function pathOnly(href: string): string {
  if (href === "#") return "#";
  const i = href.indexOf("#");
  if (i === -1) return href;
  if (i === 0) return "/";
  return href.slice(0, i);
}

function hashFromHref(href: string): string | null {
  const i = href.indexOf("#");
  if (i === -1) return null;
  return href.slice(i).toLowerCase();
}

/**
 * Exact route match — homepage "/" only skips "active" when the hash is one of
 * the Impact submenu anchors so Impact can highlight instead.
 */
function linkMatchesRoute(
  href: string,
  pathname: string,
  locationHash: string
): boolean {
  const base = pathOnly(href);
  const frag = hashFromHref(href);
  const h = (locationHash || "").toLowerCase();

  if (frag) {
    const pathNeed = base === "#" ? "/" : base;
    const pathOk =
      pathNeed === "/"
        ? pathname === "/"
        : pathname === pathNeed || pathname.startsWith(`${pathNeed}/`);
    return pathOk && h === frag;
  }

  if (base === "#" || base === "") return false;
  if (base === "/")
    return (
      pathname === "/" && !(h.length > 0 && IMPACT_HOME_HASHES.has(h))
    );
  return pathname === base || pathname.startsWith(`${base}/`);
}

function navItemActive(
  item: NavItem,
  pathname: string,
  locationHash: string
): boolean {
  if (!item.children?.length) {
    return linkMatchesRoute(item.href, pathname, locationHash);
  }
  const self = pathOnly(item.href);
  if (self !== "#" && item.href !== "#" && self !== "/") {
    if (pathname === self || pathname.startsWith(`${self}/`)) return true;
  }
  return item.children.some((c) =>
    linkMatchesRoute(c.href, pathname, locationHash)
  );
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { id: "nav-prog-all", label: "All Programs", href: "/programs" },
      {
        id: "nav-prog-school",
        label: "School Outreach",
        href: "/programs#school-outreach",
      },
      {
        id: "nav-prog-faith",
        label: "Religious Outreach",
        href: "/programs#religious-outreach",
      },
      {
        id: "nav-prog-age",
        label: "Age Stage Support",
        href: "/programs#age-stage-support",
      },
      {
        id: "nav-prog-heal",
        label: "Emotional Healing",
        href: "/programs#emotional-healing",
      },
      { id: "nav-prog-connect", label: "Sibling Connect", href: "/sibling-connect" },
      {
        id: "nav-prog-adult",
        label: "Adult Safe Place (18+)",
        href: "/adult-safe-place",
      },
      {
        id: "nav-prog-inclusive",
        label: "Inclusive Support Hub",
        href: "/inclusive-support-hub",
      },
    ],
  },
  {
    label: "Get Involved",
    href: "#",
    children: [
      { id: "nav-inv-match", label: "Match A Sibling", href: "/match" },
      { id: "nav-inv-adopt", label: "Adopt A Sibling", href: "/save-a-sibling#give" },
      { id: "nav-inv-sponsor", label: "Sponsor A Sibling", href: "/save-a-sibling#monthly-sponsor" },
      { id: "nav-inv-volunteer", label: "Volunteer", href: "/volunteer" },
      { id: "nav-inv-membership", label: "Membership", href: "/match" },
      {
        id: "nav-inv-corp",
        label: "Corporate Partnership",
        href: "/corporate-partnership",
      },
    ],
  },
  {
    label: "Impact",
    href: "#",
    children: [
      { id: "nav-impact-save", label: "Save A Sibling", href: "/save-a-sibling" },
      { id: "nav-impact-promises", label: "Our promises", href: "/#promises" },
      { id: "nav-impact-how", label: "How it works", href: "/#how-it-works" },
      { id: "nav-impact-match", label: "Matching", href: "/#matching" },
      { id: "nav-impact-stories", label: "Stories", href: "/#testimonials" },
    ],
  },
  {
    label: "Resources",
    href: "#",
    children: [{ id: "nav-res-crisis", label: "Crisis Support", href: "/crisis" }],
  },
  { label: "Contact", href: "/contact" },
];

const navActiveClass = "bg-primary/15 text-primary ring-1 ring-primary/20";
const navInactiveClass =
  "text-foreground/70 hover:bg-muted hover:text-foreground";

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationHash, setLocationHash] = useState("");

  useEffect(() => {
    const sync = () => setLocationHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    closeMobile();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="container mx-auto flex min-h-[3.75rem] items-center justify-between gap-3 px-4 py-2 md:min-h-[5.75rem] md:py-3">
        <div className="flex min-w-0 shrink-0 items-center py-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                aria-label="My True Siblings Initiative home"
                className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <BrandLogoImage
                  priority
                  className={`${BRAND_LOGO_CLASS} block align-middle`}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Go to homepage</TooltipContent>
          </Tooltip>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {navItems.map((item) => {
            const hasChildren = !!item.children?.length;
            const parentActive = navItemActive(
              item,
              pathname,
              locationHash
            );
            const anyChildActive =
              hasChildren &&
              item.children!.some((c) =>
                linkMatchesRoute(c.href, pathname, locationHash)
              );
            const parentAriaCurrent =
              parentActive && !anyChildActive ? "page" : undefined;
            return (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    parentActive ? navActiveClass : navInactiveClass
                  }`}
                  aria-current={parentAriaCurrent}
                  aria-haspopup={hasChildren || undefined}
                >
                  {item.label}
                  {hasChildren && (
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </Link>
                {hasChildren && (
                  <div
                    className="invisible absolute left-0 top-full mt-1 min-w-[220px] translate-y-1 rounded-2xl border border-border bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                    role="menu"
                  >
                    {item.children!.map((child) => {
                      const childActive = linkMatchesRoute(
                        child.href,
                        pathname,
                        locationHash
                      );
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          aria-current={childActive ? "page" : undefined}
                          className={`block rounded-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                            childActive
                              ? "bg-primary/12 font-medium text-primary"
                              : "text-foreground hover:bg-muted"
                          }`}
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="hidden rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:inline-flex"
            asChild
          >
            <Link href="/save-a-sibling">
              <Heart className="h-4 w-4" aria-hidden="true" fill="currentColor" />
              Donate
            </Link>
          </Button>
          <div className="relative lg:hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMobileOpen((o) => !o)}
                  className="cursor-pointer rounded-full p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {mobileOpen ? "Close menu" : "Open menu"}
              </TooltipContent>
            </Tooltip>
            <nav
              id="mobile-nav"
              aria-label="Mobile"
              className={`absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur transition-all duration-200 ${
                mobileOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="flex max-h-[calc(100svh-7rem)] flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                  const parentActive = navItemActive(
                    item,
                    pathname,
                    locationHash
                  );
                  const anyChildActive =
                    !!item.children?.length &&
                    item.children!.some((c) =>
                      linkMatchesRoute(c.href, pathname, locationHash)
                    );
                  const parentAriaCurrent =
                    parentActive && !anyChildActive ? "page" : undefined;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-transparent bg-background/70 p-1"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        aria-current={parentAriaCurrent}
                        className={`block rounded-xl px-3 py-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                          parentActive ? navActiveClass : navInactiveClass
                        }`}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="mt-1 flex flex-col gap-1 pl-4">
                          {item.children.map((child) => {
                            const childActive = linkMatchesRoute(
                              child.href,
                              pathname,
                              locationHash
                            );
                            return (
                              <Link
                                key={child.id}
                                href={child.href}
                                onClick={closeMobile}
                                aria-current={childActive ? "page" : undefined}
                                className={`block rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                                  childActive
                                    ? "bg-primary/12 font-medium text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button
                  variant="primary"
                  className="mt-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <Link href="/save-a-sibling" onClick={closeMobile}>
                    <Heart className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                    Donate
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
