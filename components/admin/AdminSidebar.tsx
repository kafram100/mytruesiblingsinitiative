"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  X,
  LogOut,
  ChevronDown,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

interface AdminSidebarProps {
  user: { email: string };
  navGroups: SidebarGroup[];
  sidebarOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  appName?: string;
  appSubtitle?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  user,
  navGroups = [],
  sidebarOpen,
  onClose,
  onLogout,
  appName = "My True Siblings Initiative",
  appSubtitle = "Admin Console",
  onCollapsedChange,
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<
    Record<string, boolean>
  >({});
  const navRef = useRef<HTMLDivElement>(null);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const toggleGroup = useCallback((label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }, []);

  const isGroupExpanded = (label: string) => expandedGroups[label] !== false;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = navRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-nav-item]"
      );
      if (!items || items.length === 0) return;

      const currentIndex = Array.from(items).findIndex(
        (el) => el === document.activeElement
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    },
    []
  );

  const renderNavItem = (item: SidebarItem, groupLabel: string) => {
    const itemKey = `${groupLabel}::${item.label}`;
    const button = (
      <button
        data-nav-item
        type="button"
        onClick={item.onClick}
        className={cn(
          "nav-item-btn group relative z-0 flex w-full min-h-[44px] shrink-0 items-center gap-3 rounded-xl text-left text-sm font-medium outline-none transition-[background-color,color,box-shadow] duration-150",
          "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#FFC400]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e3a3a]",
          "hover:z-10 hover:bg-white/12 hover:text-white",
          collapsed
            ? "justify-center px-0 py-2.5"
            : "px-3 py-2.5",
          item.isActive
            ? "z-[1] bg-white/15 text-white shadow-sm"
            : "text-white/65 active:bg-white/18"
        )}
      >
        <item.icon
          className={cn(
            "shrink-0 transition-colors duration-150",
            collapsed ? "h-5 w-5" : "h-4 w-4",
            item.isActive
              ? "text-[#FFC400]"
              : "text-white/45 group-hover:text-white/85"
          )}
        />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.isActive && (
              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFC400]" />
            )}
          </>
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip key={itemKey}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div key={itemKey} className="w-full">
        {button}
      </div>
    );
  };

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={cn(
          /* Solid base + gradient so the rail never renders “blank” if gradients flake */
          "relative z-10 flex min-h-dvh w-64 shrink-0 flex-col bg-[#0e3a3a] text-white",
          "bg-gradient-to-b from-[#0e3a3a] via-[#145a5a] to-[#1E5F5E]",
          "shadow-[inset_-1px_0_0_rgba(255,255,255,0.08)]",
          "transition-[width,transform] duration-200",
          collapsed ? "w-[68px]" : "w-64",
          /* Mobile drawer */
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-[60] max-lg:h-dvh max-lg:max-h-dvh max-lg:min-h-0",
          sidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          "lg:static lg:h-dvh lg:max-h-dvh lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-white/10",
            collapsed ? "justify-center px-0" : "gap-3 px-5"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFC400] to-[#FF7A00] text-sm font-extrabold text-[#1b1b1b]">
            M
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold leading-tight">
                  {appName}
                </p>
                <p className="truncate text-[10px] leading-tight text-white/60">
                  {appSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav
          ref={navRef}
          className="flex-1 overflow-y-auto px-3 py-4"
          onKeyDown={handleKeyDown}
          role="navigation"
          aria-label="Admin navigation"
        >
          {navGroups.map((group) => {
            const expanded = isGroupExpanded(group.label);
            return (
              <div
                key={group.label}
                className={cn(collapsed ? "mb-3" : "mb-5")}
              >
                <button
                  type="button"
                  onClick={() => !collapsed && toggleGroup(group.label)}
                  className={cn(
                    "flex w-full items-center transition-colors duration-150",
                    collapsed
                      ? "mb-2 justify-center"
                      : "mb-1.5 justify-between px-3 py-1"
                  )}
                  aria-expanded={collapsed ? undefined : expanded}
                  tabIndex={collapsed ? -1 : 0}
                >
                  {collapsed ? (
                    <span className="h-px w-6 bg-white/15" />
                  ) : (
                    <>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/35">
                        {group.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 text-white/30 transition-transform duration-150",
                          expanded ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>
                {(expanded || collapsed) && (
                  <div className="flex flex-col gap-1">
                    {group.items.map((item) => renderNavItem(item, group.label))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "border-t border-white/10",
            collapsed
              ? "flex flex-col gap-0.5 px-2 py-3"
              : "flex flex-col gap-0.5 px-4 py-4"
          )}
        >
          {!collapsed && (
            <div className="mb-1.5 truncate px-3 text-xs text-white/45">
              {user.email}
            </div>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "group hidden lg:flex w-full min-h-[44px] shrink-0 items-center rounded-xl text-sm outline-none transition-[background-color,color] duration-150",
              "text-white/50 hover:bg-white/12 hover:text-white active:bg-white/18",
              collapsed
                ? "justify-center py-2.5"
                : "gap-3 px-3 py-2.5"
            )}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 shrink-0 text-white/45 group-hover:text-white/85" />
                <span>Collapse</span>
              </>
            )}
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onLogout}
                className={cn(
                  "group flex w-full min-h-[44px] shrink-0 items-center rounded-xl text-sm font-medium outline-none transition-[background-color,color] duration-150",
                  "text-white/65 hover:bg-white/12 hover:text-white active:bg-white/18",
                  collapsed
                    ? "justify-center py-2.5"
                    : "gap-3 px-3 py-2.5"
                )}
              >
                <LogOut
                  className={cn(
                    "shrink-0 transition-colors duration-150",
                    collapsed ? "h-5 w-5" : "h-4 w-4",
                    "text-white/45 group-hover:text-white/85"
                  )}
                />
                {!collapsed && <span>Logout</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={8}>
                Sign out
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
