"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserInfo {
  email: string;
  role_id: number;
  user_id: number;
}

let cachedUser: UserInfo | null = null;

function getSnapshot(): UserInfo | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      if (cachedUser !== null) cachedUser = null;
      return null;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    const next = { email: payload.sub, role_id: payload.role_id, user_id: payload.user_id };
    if (cachedUser && cachedUser.email === next.email && cachedUser.role_id === next.role_id) {
      return cachedUser;
    }
    cachedUser = next;
    return cachedUser;
  } catch {
    if (cachedUser !== null) cachedUser = null;
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("auth-change", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("auth-change", cb);
  };
}

export function Header() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  }, [router]);

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold">Acara RSI</Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/events">Events</Link>
          </Button>
          {user ? (
            <>
              {user.role_id === 1 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/events">Admin</Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground mx-1">|</span>
              <span className="text-sm font-medium">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
