"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

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
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setState({
          isLoggedIn: !!data,
          userName: data?.full_name || null,
          userRole: data?.role || null,
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
