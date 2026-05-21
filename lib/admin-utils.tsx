import { ReactNode } from "react";

export function formatCurrency(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusBadge(status: string): ReactNode {
  const styles: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    login: "Logged in",
    logout: "Logged out",
    "settings.update": "Updated settings",
    "settings.test_email": "Sent test email",
    "export.contacts": "Exported contacts",
    "export.donations": "Exported donations",
  };
  return labels[action] || action;
}

export function actionColor(action: string): string {
  if (action === "login") return "text-emerald-600 bg-emerald-100";
  if (action === "logout") return "text-red-600 bg-red-100";
  if (action.startsWith("settings")) return "text-blue-600 bg-blue-100";
  if (action.startsWith("export")) return "text-purple-600 bg-purple-100";
  return "text-gray-600 bg-gray-100";
}
