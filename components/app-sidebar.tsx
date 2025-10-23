"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Inbox, CalendarIcon, LayoutGrid, Settings, CheckCircle2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Today", href: "/app", icon: CheckSquare },
  { name: "Upcoming", href: "/app/upcoming", icon: CalendarIcon },
  { name: "Inbox", href: "/app/inbox", icon: Inbox },
  { name: "Completed", href: "/app/completed", icon: CheckCircle2 },
  { name: "Calendar", href: "/app/calendar", icon: Calendar },
  { name: "Kanban", href: "/app/kanban", icon: LayoutGrid },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <CheckSquare className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className={cn("w-full justify-start", isActive && "bg-secondary")}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Link href="/app/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </aside>
  );
}
