import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/GoogleIcon";
import MicrosoftIcon from "@/components/MicrosoftIcon";
import AppleIcon from "@/components/AppleIcon";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "microsoft", label: "Continue with Microsoft", Icon: MicrosoftIcon },
  { id: "apple", label: "Continue with Apple", Icon: AppleIcon },
];

export default function AuthProviderButtons({ onSelect, busyProvider }) {
  const busy = Boolean(busyProvider);
  return (
    <div className="space-y-3">
      {PROVIDERS.map(({ id, label, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          className="w-full h-12 text-sm font-medium"
          onClick={() => onSelect(id)}
          disabled={busy}
        >
          {busyProvider === id ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
          ) : (
            <Icon className="w-5 h-5 mr-2" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );
}
