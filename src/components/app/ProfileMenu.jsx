import { LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initialsFor(name) {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function ProfileMenu() {
  const { user } = useAuth();
  const name = user?.full_name || user?.email || "Account";
  const email = user?.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-slate-300"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 font-heading text-[11px] font-bold text-primary">
              {initialsFor(name) || "V"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[130px] truncate text-[12px] font-semibold text-slate-700 sm:block">{name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="py-2.5">
          <p className="truncate font-heading text-[13px] font-bold tracking-tight text-slate-900">{name}</p>
          {email && <p className="mt-0.5 truncate text-[11.5px] font-normal text-muted-foreground">{email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => base44.auth.logout("/")}
          className="text-[12.5px] font-semibold text-slate-700"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
