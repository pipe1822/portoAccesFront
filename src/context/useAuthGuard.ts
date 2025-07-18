"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export function useAuthGuard(allowedRoles: string[]) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.replace("/");
      return;
    }
    if (!allowedRoles.includes(user.tipo_usuario)) {
      router.replace("/");
    }
  }, [user, token, allowedRoles, router]);
} 