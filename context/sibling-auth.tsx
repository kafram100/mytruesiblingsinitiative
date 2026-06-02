"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthState {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: string | null;
  loading: boolean;
  isPendingMentor: boolean;
}

const AuthCtx = createContext<AuthState>({ isLoggedIn: false, userName: null, userRole: null, loading: true, isPendingMentor: false });

export function SiblingAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ isLoggedIn: false, userName: null, userRole: null, loading: true, isPendingMentor: false });

  useEffect(() => {
    fetch("/api/auth/sibling/me")
      .then((r) => r.json())
      .then((data) => {
        setState({
          isLoggedIn: data?.authenticated === true,
          userName: data?.full_name ?? null,
          userRole: data?.role ?? null,
          isPendingMentor: data?.isPendingMentor ?? false,
          loading: false,
        });
      })
      .catch(() => setState({ isLoggedIn: false, userName: null, userRole: null, loading: false, isPendingMentor: false }));
  }, []);

  return (
    <AuthCtx.Provider value={state}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useSiblingAuth() {
  return useContext(AuthCtx);
}
