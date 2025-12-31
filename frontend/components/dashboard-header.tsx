"use client";

import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/store/userStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logoutUser } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  function avater(f: string, l: string) {
    return f
      .at(0)
      ?.toUpperCase()
      .concat(l.at(0)?.toUpperCase() ?? "");
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {isMounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer border ring-offset-background transition-opacity hover:opacity-80">
                {/* <AvatarImage src="" alt="User avatar" /> */}
                <AvatarFallback>
                  {avater(user?.firstName ?? "", user?.lastName ?? "")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutUser()}
                className="text-destructive"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Avatar className="h-9 w-9 cursor-pointer border ring-offset-background transition-opacity hover:opacity-80">
            <AvatarFallback>
              {avater(user?.firstName ?? "", user?.lastName ?? "")}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
