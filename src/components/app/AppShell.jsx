import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, BookOpen, LayoutDashboard, Mic } from "lucide-react";
import Logo from "@/components/app/Logo";
import ProfileMenu from "@/components/app/ProfileMenu";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/materials", label: "Materials", icon: BookOpen },
  { to: "/exam", label: "Voice exam", icon: Mic },
  { to: "/results", label: "Results", icon: BarChart3 },
];

function navClass({ isActive }) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
  );
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1320px]">
        <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-border/70 bg-white px-4 py-6 lg:flex">
          <Logo />
          <nav className="mt-9 flex flex-col gap-1">
            <p className="px-3 pb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                <item.icon className="h-[17px] w-[17px]" strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-border bg-slate-50/70 p-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Tip</p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-slate-600">
              Answer out loud, in full sentences. The examiner scores what you say, not what you meant.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-white/85 backdrop-blur-xl lg:hidden">
            <div className="flex h-14 items-center justify-between px-4">
              <Logo />
              <ProfileMenu />
            </div>
            <div className="hide-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold",
                      isActive ? "bg-primary/10 text-primary" : "text-slate-500",
                    )
                  }
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </header>

          <div className="sticky top-0 z-30 hidden border-b border-border/70 bg-white/85 backdrop-blur-xl lg:block">
            <div className="flex h-16 items-center justify-end px-10">
              <ProfileMenu />
            </div>
          </div>

          <main className="px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pt-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
