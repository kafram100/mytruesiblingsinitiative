import db from "@/lib/db";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: {
    id: string; title: string; description: string | null; date: string;
    time: string | null; location: string | null; image_url: string | null;
    registration_url: string | null; is_featured: number;
  }[] = [];

  try {
    const [rows] = await db.execute(
      `SELECT id, title, description, date, time, location, image_url, registration_url, is_featured
       FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 20`
    );
    events = rows as typeof events;
  } catch {}

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <main className="min-h-dvh bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Upcoming Events</h1>
          <p className="text-lg text-muted-foreground">Join our community events and connect with siblings around the world.</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">No upcoming events</h2>
            <p className="text-muted-foreground">Check back soon for new events.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <div key={e.id} className={`rounded-2xl border-2 bg-card p-6 transition-shadow hover:shadow-md ${e.is_featured ? "border-primary/30" : "border-border"}`}>
                {e.is_featured && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-3">Featured</span>
                )}
                <h2 className="text-xl font-display font-bold mb-3">{e.title}</h2>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0" />{formatDate(e.date)}</div>
                  {e.time && <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" />{e.time}</div>}
                  {e.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{e.location}</div>}
                </div>
                {e.description && <p className="text-sm text-muted-foreground mb-4">{e.description}</p>}
                {e.registration_url && (
                  <a href={e.registration_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Register Now <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
