"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  AlertTriangle, ArrowRight, ChevronDown, Globe, Heart, Home, Phone, MessageSquare,
  Search, Shield, ExternalLink, Clock, CheckCircle, Users, X, FileText, BookOpen,
  MapPin, Languages, Smartphone, Eye, Accessibility, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  VERIFIED_CRISIS_RESOURCES, COUNTRIES, US_STATES, CRISIS_TYPES,
  getResourcesByCountry, CRISIS_FAQ_ITEMS,
  type CrisisResource,
} from "@/lib/crisis";

function AccordionItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all hover:shadow-sm">
      <Button
        type="button"
        variant="tertiary"
        onClick={onClick}
        className="h-auto min-h-0 w-full justify-between gap-4 rounded-none border-0 bg-transparent px-5 py-4 text-left text-sm font-medium text-gray-800 shadow-none hover:bg-muted/40 motion-safe:hover:translate-y-0 md:px-6 md:text-base"
      >
        <span>{q}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="border-t border-border/30 px-5 py-4 text-sm leading-relaxed text-gray-600 md:px-6 md:text-base">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResourceCard({ resource, compact }: { resource: CrisisResource; compact?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-white p-5 transition-all hover:shadow-md", compact && "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{resource.serviceName}</h4>
          {!compact && <p className="mt-0.5 text-xs text-gray-500">{resource.sourceName}</p>}
        </div>
        {resource.is24_7 && (
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-700 whitespace-nowrap">24/7</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.phone && (
          <a href={`tel:${resource.phoneFormatted}`} className="inline-flex items-center gap-1 rounded-full bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold text-brand-teal transition-colors hover:bg-brand-teal/20">
            <Phone className="h-3 w-3" />{resource.phone}
          </a>
        )}
        {resource.sms && (
          <a href={`sms:${resource.smsFormatted}`} className="inline-flex items-center gap-1 rounded-full bg-brand-orange-hex/10 px-3 py-1.5 text-xs font-semibold text-brand-orange-hex transition-colors hover:bg-brand-orange-hex/20">
            <MessageSquare className="h-3 w-3" />Text {resource.sms}
          </a>
        )}
        {resource.chatUrl && (
          <a href={resource.chatUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-brand-pink-hex/10 px-3 py-1.5 text-xs font-semibold text-brand-pink-hex transition-colors hover:bg-brand-pink-hex/20">
            <MessageSquare className="h-3 w-3" />Chat
          </a>
        )}
        {resource.website && (
          <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200">
            <ExternalLink className="h-3 w-3" />Website
          </a>
        )}
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400">
          {resource.languages.length > 0 && <span className="flex items-center gap-1"><Languages className="h-3 w-3" />{resource.languages.slice(0, 2).join(", ")}{resource.languages.length > 2 && " +more"}</span>}
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{resource.hours}</span>
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" />Verified: {resource.lastVerified}</span>
        </div>
      )}
      {resource.disclaimer && (
        <p className="mt-2 text-[11px] italic leading-relaxed text-gray-400">{resource.disclaimer}</p>
      )}
    </div>
  );
}

export default function CrisisSupportPage() {
  const [searchCountry, setSearchCountry] = useState("");
  const [searchCrisisType, setSearchCrisisType] = useState("");
  const [showHelpWizard, setShowHelpWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardDanger, setWizardDanger] = useState<boolean | null>(null);
  const [wizardCountry, setWizardCountry] = useState("");
  const [wizardCrisisType, setWizardCrisisType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({});
  const [showQuickExit, setShowQuickExit] = useState(false);

  const filteredResources = useMemo(() => {
    return VERIFIED_CRISIS_RESOURCES.filter((r) => {
      if (searchCountry && !r.country.toLowerCase().includes(searchCountry.toLowerCase()) && r.country !== "Global") return false;
      if (searchCrisisType && !r.crisisTypes.includes(searchCrisisType)) return false;
      return true;
    });
  }, [searchCountry, searchCrisisType]);

  const countryResources = useMemo(() => {
    if (!selectedCountry) return [];
    return getResourcesByCountry(selectedCountry);
  }, [selectedCountry]);

  const quickExit = useCallback(() => {
    window.location.href = "https://www.google.com";
  }, []);

  const resourcesByCountry = useMemo(() => {
    const map: Record<string, CrisisResource[]> = {};
    VERIFIED_CRISIS_RESOURCES.forEach((r) => {
      if (!map[r.country]) map[r.country] = [];
      map[r.country].push(r);
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* QUICK EXIT BAR */}
      <div className="fixed right-3 top-3 z-50 flex items-start gap-2">
        {showQuickExit && (
          <div className="rounded-lg bg-black/80 px-3 py-2 text-xs text-white shadow-lg max-w-40">
            <Lock className="mb-1 h-3 w-3" />
            <p>Clear your history or use private browsing if someone monitors your device.</p>
          </div>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={quickExit}
          onMouseEnter={() => setShowQuickExit(true)}
          onMouseLeave={() => setShowQuickExit(false)}
          className="flex items-center gap-1.5 rounded-full bg-brand-red-hex px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-lg hover:bg-brand-red-hex/90 hover:shadow-xl md:px-4 md:py-2 md:text-sm"
        >
          <X className="h-3.5 w-3.5" />
          Quick Exit
        </Button>
      </div>

      {/* EMERGENCY ALERT BANNER — top, text only */}
      <div className="bg-brand-red-hex pt-14 md:pt-0">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-white" />
              <p className="text-base font-bold text-white md:text-lg">
                In immediate danger? Call your local emergency number now.
              </p>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              USA: 911 &middot; Canada: 911 &middot; UK: 999 or 112 &middot; EU: 112 &middot; Nigeria: 112 &middot; Australia: 000 &middot; New Zealand: 111
            </p>
          </div>
          {/* CTAs brought down inside the banner */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="secondary" className="rounded-full border-0 bg-white px-5 py-2.5 text-sm font-bold text-brand-red-hex shadow-md hover:bg-gray-50 hover:shadow-lg">
              <a href="tel:911">
                <Phone className="h-3.5 w-3.5" />Call 911 (US/Canada)
              </a>
            </Button>
            <Button asChild variant="secondary" className="rounded-full border-0 bg-white/20 px-5 py-2.5 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-white/30">
              <a href="tel:988">
                <Phone className="h-3.5 w-3.5" />Call 988 (Crisis)
              </a>
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowHelpWizard(true)} className="rounded-full border-2 border-white/40 bg-transparent px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-none backdrop-blur-0 hover:bg-white/10">
              <Search className="h-3.5 w-3.5" />Find Help Near Me
            </Button>
          </div>
        </div>
      </div>

      {/* DISCLAIMER BANNER */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2 text-center text-[11px] text-gray-500 leading-relaxed">
          <Shield className="mb-0.5 inline-block h-3 w-3 text-gray-400" />{" "}
          MyTrueSiblings provides connection, emotional support guidance, and resource navigation. We do not replace emergency services, licensed medical care, crisis intervention, therapy, law enforcement, or hospital care.{" "}
          <Button variant="tertiary" type="button" onClick={() => setShowHelpWizard(true)} className="h-auto inline p-0 text-xs font-semibold leading-relaxed text-brand-teal underline shadow-none hover:bg-transparent hover:text-brand-teal motion-safe:hover:translate-y-0">
            Find help now
          </Button>
        </div>
      </div>

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-white via-brand-teal/[0.03] to-brand-pink-hex/[0.03] py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-red-hex/10 px-4 py-1.5 text-xs font-semibold text-brand-red-hex">
              <Heart className="h-3.5 w-3.5" /> Crisis Support
            </div>
            <h1 className="font-display text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              You Are Not Alone.{" "}
              <span className="text-brand-red-hex">Help Is Available Now.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              If you are feeling unsafe, overwhelmed, or in danger, please reach out immediately.
              MyTrueSiblings can help guide you to trusted crisis support resources, but emergency
              help should always come from licensed professionals and local emergency services.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setShowHelpWizard(true)} variant="primary" size="lg" className="rounded-full bg-brand-red-hex px-8 py-6 text-base text-primary-foreground shadow-xl shadow-brand-red-hex/30 hover:bg-brand-red-hex/90">
                <Search className="h-5 w-5" />Find Help In My Country
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full border-2 border-brand-teal/30 px-6 py-6 text-base text-brand-teal hover:bg-brand-teal/5">
                <a href="tel:988"><Phone className="h-5 w-5" />Call Or Text Crisis Line</a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full px-6 py-6 text-base">
                <Link href="#help-someone"><Users className="h-5 w-5" />Help Someone Else</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HELP WIZARD MODAL */}
      <AnimatePresence>
        {showHelpWizard && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button
                type="button"
                variant="secondary"
                aria-label="Close dialog"
                className="absolute inset-0 h-full min-h-12 w-full rounded-none border-0 bg-black/60 p-0 shadow-none backdrop-blur-sm hover:bg-black/60 hover:shadow-none motion-safe:hover:translate-y-0"
                onClick={() => setShowHelpWizard(false)}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8"
            >
              <Button type="button" variant="tertiary" size="icon" onClick={() => setShowHelpWizard(false)} className="absolute right-4 top-4 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                <X className="h-4 w-4" />
              </Button>

              {wizardStep === 1 && (
                <div className="text-center">
                  <AlertTriangle className="mx-auto h-10 w-10 text-brand-red-hex" />
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">Are you in immediate danger?</h3>
                  <p className="mt-2 text-sm text-gray-500">This will help us guide you to the right help.</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button onClick={() => { setWizardDanger(true); setWizardStep(4); }} variant="primary" className="flex-1 rounded-full bg-brand-red-hex text-primary-foreground hover:bg-brand-red-hex/90">
                      Yes — I need emergency help
                    </Button>
                    <Button onClick={() => { setWizardDanger(false); setWizardStep(2); }} variant="secondary" className="flex-1 rounded-full">
                      No — I need crisis support
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="text-center">
                  <Globe className="mx-auto h-10 w-10 text-brand-teal" />
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">What country are you in?</h3>
                  <div className="mt-4 max-h-48 overflow-y-auto space-y-1">
                    {COUNTRIES.map((c) => (
                      <Button
                        key={c.code}
                        type="button"
                        variant="tertiary"
                        onClick={() => { setWizardCountry(c.name); setWizardStep(3); }}
                        className="w-full justify-start rounded-xl border-0 px-4 py-2.5 text-left text-sm font-medium text-gray-700 shadow-none hover:bg-brand-teal/5 hover:text-brand-teal"
                      >
                        {c.name}
                      </Button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-400">Country not listed? <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">Visit Find a Helpline</a></p>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="text-center">
                  <Heart className="mx-auto h-10 w-10 text-brand-pink-hex" />
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">What kind of help do you need?</h3>
                  <p className="mt-1 text-sm text-gray-500">{wizardCountry}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { value: "suicide", label: "Suicide / Self Harm" },
                      { value: "mental-health", label: "Mental Health Crisis" },
                      { value: "domestic-violence", label: "Abuse / Domestic Violence" },
                      { value: "sexual-violence", label: "Sexual Violence" },
                      { value: "child-safety", label: "Child Safety" },
                      { value: "substance-use", label: "Substance Use" },
                      { value: "homelessness", label: "Homelessness" },
                      { value: "caregiver-crisis", label: "Caregiver Crisis" },
                      { value: "disability-emergency", label: "Disability Emergency" },
                      { value: "other", label: "Other Crisis" },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        type="button"
                        variant="secondary"
                        onClick={() => { setWizardCrisisType(opt.value); setWizardStep(4); }}
                        className="h-auto min-h-0 rounded-xl border-border/50 p-3 text-center text-xs font-medium leading-snug hover:border-brand-teal hover:text-brand-teal motion-safe:hover:translate-y-0"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="text-center">
                  {wizardDanger ? (
                    <>
                      <AlertTriangle className="mx-auto h-12 w-12 text-brand-red-hex" />
                      <h3 className="mt-4 font-display text-xl font-bold text-gray-900">Call Emergency Services Now</h3>
                      <p className="mt-2 text-sm text-gray-600">Please call your local emergency number immediately.</p>
                      <div className="mt-6 space-y-3">
                        <Button asChild variant="primary" size="lg" className="w-full rounded-full bg-brand-red-hex px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg hover:bg-brand-red-hex/90">
                          <a href="tel:911">Call 911 (US/Canada)</a>
                        </Button>
                        <Button asChild variant="primary" size="lg" className="w-full rounded-full bg-brand-red-hex px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg hover:bg-brand-red-hex/90">
                          <a href="tel:999">Call 999 (UK)</a>
                        </Button>
                        <Button asChild variant="primary" size="lg" className="w-full rounded-full bg-brand-red-hex px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg hover:bg-brand-red-hex/90">
                          <a href="tel:112">Call 112 (EU/Nigeria)</a>
                        </Button>
                        <p className="text-xs text-gray-400">Go to the nearest hospital, police station, or fire station if you cannot call.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Heart className="mx-auto h-10 w-10 text-brand-teal" />
                      <h3 className="mt-4 font-display text-xl font-bold text-gray-900">Here are resources for you</h3>
                      <p className="mt-1 text-sm text-gray-500">{wizardCountry} &middot; {wizardCrisisType}</p>
                      <div className="mt-4 max-h-60 space-y-3 overflow-y-auto text-left">
                        {getResourcesByCountry(wizardCountry)
                          .filter((r) => wizardCrisisType === "other" || r.crisisTypes.includes(wizardCrisisType) || r.crisisTypes.includes("all-crisis"))
                          .slice(0, 3)
                          .map((r) => <ResourceCard key={r.id} resource={r} compact />)}
                        {getResourcesByCountry(wizardCountry).length === 0 && (
                          <p className="text-sm text-gray-500">
                            No specific resources found. Please visit{" "}
                            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">Find a Helpline</a>{" "}
                            or call your local emergency number.
                          </p>
                        )}
                      </div>
                      <p className="mt-4 text-xs italic text-gray-400">
                        If you cannot reach a helpline, go to the nearest hospital, police station, fire station, clinic, trusted adult, neighbor, or public safe place.
                      </p>
                    </>
                  )}
                  <div className="mt-4">
                    <Button type="button" variant="tertiary" onClick={() => setShowHelpWizard(false)} className="h-auto p-0 text-xs font-normal normal-case text-gray-400 underline shadow-none hover:bg-transparent hover:text-gray-600 motion-safe:hover:translate-y-0">
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAFETY PLAN */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Shield className="mx-auto h-8 w-8 text-brand-teal" />
              <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">Small Safety Plan</h2>
              <p className="mt-2 text-sm text-gray-500">You don&apos;t have to fix everything tonight. Just one step, right now, is enough.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Reach a person, not a screen", desc: "Call or text a crisis line. If you can't speak, the operator will guide you with simple yes/no questions." },
                { title: "Move to a safer space", desc: "Step away from anything harmful. Move to a different room. Open a window. Step outside if it is safe." },
                { title: "Tell one person", desc: "Text a friend, sibling, coworker. You don't have to explain. \"I'm not okay\" is enough." },
                { title: "Stay until the wave passes", desc: "Crisis moments are storms: they pass. Keep talking, moving, breathing. You do not have to make any other decision tonight." },
              ].map((step) => (
                <div key={step.title} className="rounded-2xl border border-border/50 bg-white p-5 transition-all hover:shadow-md">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="bg-brand-light/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Search className="mx-auto h-8 w-8 text-brand-teal" />
              <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">Find Crisis Support Worldwide</h2>
              <p className="mt-2 text-sm text-gray-500">Search verified crisis resources by country and type of support needed.</p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={searchCountry} onChange={(e) => setSearchCountry(e.target.value)}
                  placeholder="Search by country..."
                  className="w-full rounded-full border-2 border-border/50 bg-white px-11 py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                />
              </div>
              <select value={searchCrisisType} onChange={(e) => setSearchCrisisType(e.target.value)}
                className="rounded-full border-2 border-border/50 bg-white px-5 py-3.5 text-sm text-gray-600 outline-none transition-all focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 sm:max-w-[200px]">
                <option value="">All crisis types</option>
                <option value="suicide">Suicide / Self Harm</option>
                <option value="domestic-violence">Domestic Violence</option>
                <option value="mental-health">Mental Health</option>
                <option value="sexual-violence">Sexual Violence</option>
                <option value="child-safety">Child Safety</option>
                <option value="substance-use">Substance Use</option>
                <option value="lgbtq">LGBTQ+ Support</option>
                <option value="veterans">Veterans</option>
              </select>
            </div>

            <div className="mt-8 space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.slice(0, 12).map((r) => <ResourceCard key={r.id} resource={r} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <Globe className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No resources found. Try a different search or visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">Find a Helpline</a>.</p>
                </div>
              )}
              {filteredResources.length > 12 && (
                <p className="text-center text-xs text-gray-400">Showing 12 of {filteredResources.length} resources. Refine your search for more specific results.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRY DIRECTORY */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Globe className="mx-auto h-8 w-8 text-brand-teal" />
              <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">Country Crisis Directory</h2>
              <p className="mt-2 text-sm text-gray-500">Select a country to view verified crisis resources.</p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {COUNTRIES.map((c) => (
                <Button
                  key={c.code}
                  type="button"
                  variant={selectedCountry === c.name ? "primary" : "secondary"}
                  onClick={() => setSelectedCountry(selectedCountry === c.name ? null : c.name)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium shadow-none motion-safe:hover:translate-y-0",
                    selectedCountry === c.name
                      ? "bg-brand-teal text-primary-foreground shadow-md hover:bg-brand-teal/90 hover:text-primary-foreground"
                      : "border-0 bg-brand-light font-medium text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {c.name}
                </Button>
              ))}
            </div>

            <AnimatePresence>
              {selectedCountry && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-4">
                  <h3 className="font-display text-xl font-bold text-gray-900">{selectedCountry} Resources</h3>
                  {countryResources.length > 0 ? countryResources.map((r) => <ResourceCard key={r.id} resource={r} />) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                      <p className="text-sm text-gray-500">Resources loading. Please visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">Find a Helpline</a> for {selectedCountry}.</p>
                    </div>
                  )}
                  <p className="text-center text-[11px] text-gray-400">Last updated: April 2026. Resources verified from official sources including SAMHSA, Befrienders Worldwide, IASP, and government health ministries.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* USA STATE DIRECTORY */}
      <section className="bg-brand-light/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-brand-teal" />
              <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">United States — State Resources</h2>
              <p className="mt-2 text-sm text-gray-500">Select a state for local crisis resources. 988 connects you to your local crisis center.</p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {US_STATES.map((state) => (
                <Button
                  key={state}
                  type="button"
                  variant={selectedState === state ? "primary" : "secondary"}
                  onClick={() => setSelectedState(selectedState === state ? null : state)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium shadow-none motion-safe:hover:translate-y-0",
                    selectedState === state
                      ? "bg-brand-teal text-primary-foreground shadow-md hover:bg-brand-teal/90 hover:text-primary-foreground"
                      : "border-border/50 bg-white text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {state}
                </Button>
              ))}
            </div>

            <AnimatePresence>
              {selectedState && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-4 rounded-2xl border border-border/50 bg-white p-6">
                  <h3 className="font-display text-xl font-bold text-gray-900">{selectedState}</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border/30 bg-brand-teal/[0.04] p-4">
                      <p className="text-sm font-semibold text-brand-teal">988 Suicide & Crisis Lifeline</p>
                      <p className="mt-1 text-xs text-gray-500">Call or text 988. You will be connected to the 988 crisis center in {selectedState}. Free, confidential, 24/7.</p>
                      <a href="tel:988" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold text-brand-teal">Call 988</a>
                    </div>
                    <div className="rounded-xl border border-border/30 bg-brand-red-hex/[0.04] p-4">
                      <p className="text-sm font-semibold text-brand-red-hex">Emergency</p>
                      <p className="mt-1 text-xs text-gray-500">Call 911 for immediate danger, police, fire, or ambulance.</p>
                      <a href="tel:911" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-red-hex/10 px-3 py-1.5 text-xs font-semibold text-brand-red-hex">Call 911</a>
                    </div>
                    <div className="rounded-xl border border-border/30 p-4">
                      <p className="text-sm font-semibold text-gray-700">Additional Resources</p>
                      <ul className="mt-2 space-y-1 text-xs text-gray-500">
                        <li>Domestic Violence: <a href="tel:8007997233" className="text-brand-teal">800-799-7233</a></li>
                        <li>Child Abuse: <a href="tel:8004224453" className="text-brand-teal">800-422-4453</a></li>
                        <li>Sexual Assault: <a href="tel:8006564673" className="text-brand-teal">800-656-4673</a></li>
                        <li>SAMHSA: <a href="tel:8006624357" className="text-brand-teal">800-662-4357</a></li>
                        <li>Veterans: Call 988 then press 1</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400">Source: SAMHSA, 988 Suicide & Crisis Lifeline. Last verified April 2026.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* HELP SOMEONE ELSE */}
      <section id="help-someone" className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Users className="mx-auto h-10 w-10 text-brand-teal" />
              <h2 className="mt-4 font-display text-2xl font-bold text-gray-900 md:text-3xl">Worried About Someone?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                If someone says they want to die, feels unsafe, is being abused, or may harm themselves or others:
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Stay with them if it is safe to do so.",
                "Remove immediate danger if possible.",
                "Contact emergency services or a crisis line.",
                "Do not leave a person alone if they are in immediate danger.",
                "Do not promise secrecy if someone's life is at risk.",
                "Encourage them to speak with a crisis counselor, doctor, or trusted adult.",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 rounded-xl border border-border/50 p-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  <span className="text-xs text-gray-600 md:text-sm">{tip}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => setShowHelpWizard(true)} variant="primary" size="lg" className="rounded-full bg-brand-teal px-8 text-primary-foreground hover:bg-brand-teal/90">
                <Users className="h-5 w-5" />Find Help For Someone Else
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESSIBILITY */}
      <section className="bg-brand-light/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Accessibility className="mx-auto h-8 w-8 text-brand-teal" />
              <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">Accessible Crisis Support</h2>
              <p className="mt-2 text-sm text-gray-500">Help should be accessible to everyone. Here are options for different needs.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: MessageSquare, title: "Text Support", desc: "Crisis Text Line (US): Text HOME to 741741. UK: Text SHOUT to 85258. Canada: Text 686868." },
                { icon: MessageSquare, title: "Chat Support", desc: "988 Lifeline Chat, TrevorChat, and many local crisis chat services are available." },
                { icon: Eye, title: "Deaf & Hard of Hearing", desc: "TTY: 711 then 988 (US). Text-based crisis lines work without voice. Video relay available for some services." },
                { icon: FileText, title: "Screen Reader Friendly", desc: "This page is optimized for screen readers. Most crisis websites follow accessibility standards." },
                { icon: Smartphone, title: "Large Text Option", desc: "Use browser zoom or accessibility settings on your device to enlarge text on this page." },
                { icon: Languages, title: "Translation Support", desc: "988 offers 250+ language interpretation. Many crisis lines offer multilingual support." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border/50 bg-white p-5 text-left transition-all hover:shadow-md">
                    <Icon className="h-6 w-6 text-brand-teal" />
                    <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & QUICK EXIT */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Lock className="mx-auto h-8 w-8 text-brand-teal" />
            <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">Your Privacy Matters</h2>
            <p className="mt-2 text-sm text-gray-500">
              If someone monitors your phone or browser, please use these precautions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button type="button" variant="primary" onClick={quickExit} className="rounded-full bg-brand-red-hex px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-brand-red-hex/90">
                <X className="h-4 w-4" />Quick Exit — Leave This Page
              </Button>
              <Button asChild variant="secondary" className="rounded-full px-6 py-3 text-sm font-semibold text-gray-700">
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />Go To Google
                </a>
              </Button>
            </div>
            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <p>Clear your browsing history after visiting this page.</p>
              <p>Use a private or incognito browsing window if possible.</p>
              <p>Consider using a device that is not monitored by someone who may harm you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-light/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <BookOpen className="mx-auto h-8 w-8 text-brand-teal" />
              <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 md:text-3xl">Frequently Asked Questions</h2>
              <p className="mt-2 text-sm text-gray-500">Common questions about crisis support and safety.</p>
            </div>
            <div className="mt-8 space-y-3">
              {CRISIS_FAQ_ITEMS.map((item, idx) => {
                const key = `faq-${idx}`;
                return (
                  <AccordionItem key={key} q={item.q} a={item.a} isOpen={!!openFaq[key]} onClick={() => setOpenFaq((prev) => ({ ...prev, [key]: !prev[key] }))} />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-brand-red-hex/5 via-white to-brand-teal/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="mx-auto h-10 w-10 text-brand-red-hex" />
            <h2 className="mt-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              Your Life Matters. <span className="text-brand-red-hex">Please Reach Out Now.</span>
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              You do not have to go through this alone. Help is available, and people care about you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setShowHelpWizard(true)} variant="primary" size="lg" className="rounded-full bg-brand-red-hex px-8 py-6 text-base text-primary-foreground shadow-xl shadow-brand-red-hex/30 hover:bg-brand-red-hex/90">
                <Search className="h-5 w-5" />Find Crisis Support
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full border-2 border-brand-red-hex/30 px-6 py-6 text-base text-brand-red-hex hover:bg-brand-red-hex/5">
                <a href="tel:988"><Phone className="h-4 w-4" />Call Emergency Services</a>
              </Button>
              <Button asChild variant="primary" size="lg" className="rounded-full bg-brand-teal px-6 py-6 text-base text-primary-foreground hover:bg-brand-teal/90">
                <a href="sms:741741"><MessageSquare className="h-4 w-4" />Text A Crisis Line</a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full px-6 py-6 text-base">
                <Link href="/adult-safe-place">
                  <Home className="h-5 w-5" />Return To Safe Space
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM DISCLAIMER */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-[11px] leading-relaxed text-gray-500">
          <Shield className="mb-1 inline-block h-3 w-3 text-gray-400" />{" "}
          MyTrueSiblings provides connection, emotional support guidance, and resource navigation. We do not replace emergency services, licensed medical care, crisis intervention, therapy, law enforcement, or hospital care. Crisis resource data is sourced from official and verified directories including SAMHSA, IASP, Befrienders Worldwide, Find a Helpline, and government health ministries. Last verified April 2026. If you believe any information is outdated or incorrect, please contact us.
        </div>
      </div>
    </div>
  );
}
