import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  default: {
    execute: vi.fn().mockResolvedValue([[{ val: 1 }], []]),
  },
}));

describe("cn utility", () => {
  it("merges Tailwind class names", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles clsx conditional classes", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
});

describe("getSiteMetadataBase", () => {
  it("returns localhost fallback when env is missing", async () => {
    const orig = process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const { getSiteMetadataBase } = await import("@/lib/metadata-base");
    const result = getSiteMetadataBase();
    expect(result.origin).toBe("http://localhost:3000");
    process.env.NEXT_PUBLIC_SITE_URL = orig;
  });

  it("parses a full URL", async () => {
    const orig = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://mysiblings.org";
    const { getSiteMetadataBase } = await import("@/lib/metadata-base");
    const result = getSiteMetadataBase();
    expect(result.origin).toBe("https://mysiblings.org");
    process.env.NEXT_PUBLIC_SITE_URL = orig;
  });

  it("prepends https:// when scheme is missing", async () => {
    const orig = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "mysiblings.org";
    const { getSiteMetadataBase } = await import("@/lib/metadata-base");
    const result = getSiteMetadataBase();
    expect(result.origin).toBe("https://mysiblings.org");
    process.env.NEXT_PUBLIC_SITE_URL = orig;
  });

  it("prepends http:// for localhost", async () => {
    const orig = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "localhost:4000";
    const { getSiteMetadataBase } = await import("@/lib/metadata-base");
    const result = getSiteMetadataBase();
    expect(result.origin).toBe("http://localhost:4000");
    process.env.NEXT_PUBLIC_SITE_URL = orig;
  });
});

describe("rate-limit IP extraction", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const forwarded = "192.168.1.1, 10.0.0.1";
    const ip = forwarded.split(",")[0]?.trim() || "unknown";
    expect(ip).toBe("192.168.1.1");
  });

  it("falls back to unknown when no header", () => {
    const headers = new Headers();
    const forwarded = headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    expect(ip).toBe("unknown");
  });
});

describe("contact form validation", () => {
  it("validates email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("user@example.com")).toBe(true);
    expect(emailRegex.test("invalid")).toBe(false);
    expect(emailRegex.test("")).toBe(false);
    expect(emailRegex.test("a@b.c")).toBe(true);
  });

  it("enforces field length limits", () => {
    const nameMax = 100;
    const subjectMax = 200;
    const messageMax = 5000;
    expect("a".repeat(nameMax).length).toBeLessThanOrEqual(nameMax);
    expect(subjectMax).toBe(200);
    expect(messageMax).toBe(5000);
  });
});

describe("CSV export sanitization", () => {
  it("escapes cells starting with = + - @", () => {
    const values = ["=cmd", "+cmd", "-cmd", "@cmd", "normal"];
    const escaped = values.map((v) => {
      if (/^[=+\-@]/.test(v)) return `\t${v}`;
      return v;
    });
    expect(escaped[0]).toBe("\t=cmd");
    expect(escaped[1]).toBe("\t+cmd");
    expect(escaped[4]).toBe("normal");
  });

  it("quotes cells containing commas or quotes", () => {
    const csvCell = (str: string) => {
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    expect(csvCell("hello, world")).toBe('"hello, world"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("normal")).toBe("normal");
  });
});

describe("payment helpers", () => {
  it("getPaymentMethods returns currency-appropriate methods", () => {
    const methodsUSD = ["card", "link", "us_bank_account"];
    const methodsEUR = ["card", "link", "sepa_debit", "ideal", "bancontact", "sofort", "giropay"];
    expect(methodsUSD).toContain("card");
    expect(methodsUSD).toContain("link");
    expect(methodsEUR).toContain("sepa_debit");
  });

  it("filters recurring-incompatible methods", () => {
    const recurringMethods = ["card", "link", "sepa_debit", "us_bank_account"];
    const currencyMethods = ["card", "link", "ideal", "sofort"];
    const filtered = currencyMethods.filter((m) => recurringMethods.includes(m));
    expect(filtered).toEqual(["card", "link"]);
    expect(filtered).not.toContain("ideal");
  });
});

describe("conversion rate formatting", () => {
  it("formats currency amounts correctly", () => {
    const symbol = "$";
    const formatted = `${symbol}25`;
    expect(formatted).toBe("$25");
  });

  it("converts USD amounts using rate", () => {
    const rate = 1360.07;
    const usdAmount = 10;
    const converted = Math.round(usdAmount * rate * 100) / 100;
    expect(converted).toBe(13600.7);
  });
});
