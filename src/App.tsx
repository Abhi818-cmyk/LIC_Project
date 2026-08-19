import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

const PHONE = "919828620634";
const DISPLAY_PHONE = "+91 98286 20634";
const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
const MAP_URL = "https://maps.app.goo.gl/i1o9ZcnDnD2LvHeH6";
const DEFAULT_WHATSAPP_MESSAGE = "Hello Mahesh Ji, I visited your website and would like a free consultation regarding insurance planning.";
const whatsappLink = (message = DEFAULT_WHATSAPP_MESSAGE) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

type IconName = "phone" | "whatsapp" | "shield" | "family" | "growth" | "retirement" | "document" | "support" | "check" | "map" | "mail" | "clock" | "arrow" | "star";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<IconName, ReactNode> = {
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />,
    whatsapp: <><path d="M20.5 3.5A10 10 0 0 0 4.8 15.6L3.3 21l5.5-1.4A10 10 0 1 0 20.5 3.5Z" /><path d="M8.5 7.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4 0 .7.8 1.4 1.9 2.4 3.4 3 .3.1.5.1.7-.1l.9-1.1c.2-.3.5-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .4-.2 1.5-1 2.1-.7.6-1.7.9-2.8.6-1.6-.4-3.5-1.1-5.5-3-1.6-1.5-2.7-3.4-3-4.9-.2-.9.2-1.8.5-2.3Z" /></>,
    shield: <><path d="M12 22s8-3.7 8-10V5l-8-3-8 3v7c0 6.3 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
    family: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M15 15a5 5 0 0 1 6 4v2" /></>,
    growth: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V7" /><path d="m3 8 6-5 6 6 7-6" /></>,
    retirement: <><path d="M3 21h18M5 21V10h14v11M2 10l10-7 10 7" /><path d="M9 14h6v7" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    support: <><circle cx="12" cy="12" r="9" /><path d="M3 12h3M18 12h3M12 3v3M12 18v3" /><circle cx="12" cy="12" r="3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    map: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    star: <path d="m12 2.8 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.4 6.3-.9Z" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function CountUp({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (reduceMotion) {
        setValue(end);
        observer.disconnect();
        return;
      }
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - started) / 950, 1);
        setValue(Math.round(end * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [end]);

  return <div><strong ref={ref}>{value.toLocaleString("en-IN")}<sup>{suffix}</sup></strong><span>{label}</span></div>;
}

const services: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Life Protection", text: "Personal life insurance guidance for families in Khandar, Sawai Madhopur and nearby areas." },
  { icon: "growth", title: "Savings Planning", text: "Understand disciplined, long-term savings options around your financial goals." },
  { icon: "family", title: "Child Future Planning", text: "Plan for education, higher studies and important milestones in your child's future." },
  { icon: "retirement", title: "Retirement Planning", text: "Build a practical financial plan for greater confidence after retirement." },
  { icon: "document", title: "Existing Policy Review", text: "Understand existing policy benefits, premiums, maturity, service and coverage." },
  { icon: "support", title: "Claim Assistance", text: "Get guidance on required documents and next steps during the claim process." },
];

const whyPoints: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "25+ years experience", text: "Long-standing industry experience focused on responsible guidance." },
  { icon: "family", title: "5,000+ policyholders", text: "A broad base of families served over more than two decades." },
  { icon: "document", title: "Easy Hindi explanations", text: "Policy details and commitments explained in simple language." },
  { icon: "check", title: "Transparent guidance", text: "Needs-based consultation without exaggerated or guaranteed claims." },
  { icon: "support", title: "Long-term support", text: "Policy review, servicing and claim-document assistance when needed." },
  { icon: "map", title: "Strong local presence", text: "Accessible support in Khandar, Sawai Madhopur and nearby areas." },
];

const faqs = [
  { q: "How can I contact a life insurance advisor in Khandar?", a: `Call Mahesh Kumar Mathuria on ${DISPLAY_PHONE}, message on WhatsApp, or submit the callback form on this website.` },
  { q: "Does Mahesh Ji provide online consultation?", a: "Yes. You can have an initial discussion by phone or WhatsApp, and plan an in-person meeting when required." },
  { q: "Can I get my existing insurance policy reviewed?", a: "Yes. Mahesh ji can help you understand policy benefits, premiums, maturity, coverage and service requirements." },
  { q: "Is claim assistance available in Sawai Madhopur?", a: "Guidance is available for claim documents and next steps. Final claim decisions remain subject to the insurer's rules and policy terms." },
  { q: "Can I discuss retirement planning?", a: "Yes. You can discuss your retirement goals, time horizon and existing arrangements during a personal consultation." },
  { q: "Do you provide guidance for children's future planning?", a: "Yes. Guidance can cover long-term planning for education, higher studies and other important future milestones." },
  { q: "Which locations do you serve?", a: "Mahesh ji is based in Khandar and serves Sawai Madhopur and nearby areas, with phone and WhatsApp support for other locations." },
  { q: "How can I request a callback?", a: "Complete the short form, then send the prepared WhatsApp message so Mahesh ji or the team can receive your request." },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#mahesh-kumar-mathuria`,
      name: "Mahesh Kumar Mathuria",
      jobTitle: "Senior Life Insurance Advisor",
      telephone: "+919828620634",
      email: "mkmathuria10358@gmail.com",
      url: SITE_URL,
      image: `${SITE_URL}/mahesh-kumar-mathuria-profile.webp`,
      knowsAbout: ["Life insurance", "Savings planning", "Child future planning", "Retirement planning", "Policy review", "Claim assistance"],
      address: { "@type": "PostalAddress", addressLocality: "Khandar", addressRegion: "Rajasthan", addressCountry: "IN" },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#advisor-service`,
      name: "Mahesh Kumar Mathuria – Senior Life Insurance Advisor",
      description: "Personal life insurance guidance in Khandar, Sawai Madhopur and nearby areas.",
      url: SITE_URL,
      image: `${SITE_URL}/mahesh-kumar-mathuria-profile.webp`,
      telephone: "+919828620634",
      email: "mkmathuria10358@gmail.com",
      founder: { "@id": `${SITE_URL}/#mahesh-kumar-mathuria` },
      areaServed: ["Khandar", "Sawai Madhopur", "Rajasthan"],
      hasMap: MAP_URL,
      address: { "@type": "PostalAddress", addressLocality: "Khandar", addressRegion: "Rajasthan", addressCountry: "IN" },
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Insurance Advisory Services", itemListElement: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.title, description: service.text } })) },
    },
  ],
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState(whatsappLink());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello Mahesh Ji, I visited your website and would like a free consultation regarding insurance planning.",
      "",
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Requirement: ${form.get("requirement")}`,
      `City: ${form.get("city") || "Not provided"}`,
    ].join("\n");
    setSubmittedWhatsAppUrl(whatsappLink(message));
    setSubmitted(true);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="topbar"><div className="container topbar-inner"><span><Icon name="clock" size={16} /> 25+ years of trusted insurance guidance</span><a href={`tel:+${PHONE}`}><Icon name="phone" size={16} /> {DISPLAY_PHONE}</a></div></div>

      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="Mahesh Kumar Mathuria home"><span className="brand-mark"><img src="/mahesh-advisor-logo-192.png" alt="" width="192" height="192" /></span><span><strong>Mahesh Kumar Mathuria</strong><small>Senior Life Insurance Advisor</small></span></a>
          <button className="menu-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span></button>
          <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
            <a href="#home" onClick={closeMenu}>Home</a><a href="#about" onClick={closeMenu}>About</a><a href="#services" onClick={closeMenu}>Services</a><a href="#why-us" onClick={closeMenu}>Why Us</a><a href="#faq" onClick={closeMenu}>FAQ</a><a href="#contact" onClick={closeMenu}>Contact</a>
            <a className="nav-cta" href={whatsappLink()} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Free Consultation</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow hero-glow-one"></div><div className="hero-glow hero-glow-two"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span></span> Personal guidance. Lifelong support.</div>
            <h1>Trusted Life Insurance Guidance<br /> <em>for Your Family&apos;s Future</em></h1>
            <p className="hero-lead">Personal guidance for life protection, savings, children&apos;s future and retirement from Mahesh Kumar Mathuria, a Senior Life Insurance Advisor serving Khandar and Sawai Madhopur.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">Get Free Consultation <Icon name="arrow" size={18} /></a>
              <a className="button button-secondary whatsapp-secondary" href={whatsappLink()} target="_blank" rel="noreferrer"><Icon name="whatsapp" /> WhatsApp Mahesh Ji</a>
            </div>
            <a className="hero-call-link" href={`tel:+${PHONE}`}><Icon name="phone" size={18} /> Call now: {DISPLAY_PHONE}</a>
            <div className="hero-proof"><div className="avatar-stack" aria-hidden="true"><span>M</span><span>K</span><span>+</span></div><div><strong>5,000+ policyholders served</strong><small>Clear advice, dependable service</small></div></div>
          </div>

        </div>
      </section>

      <section className="trust-strip" aria-label="Experience highlights"><div className="container stats-grid"><CountUp end={25} suffix="+" label="Years industry experience" /><CountUp end={5000} suffix="+" label="Families served" /><CountUp end={20} suffix="+" label="Advisor support team" /><div><strong>1-to-1</strong><span>Personal consultation</span></div></div></section>

      <section className="section about" id="about"><div className="container about-grid">
        <div className="about-visual"><div className="portrait-glow"></div><figure className="about-portrait"><img src="/mahesh-kumar-mathuria-profile.webp" alt="Mahesh Kumar Mathuria, Senior Life Insurance Advisor in Khandar, Sawai Madhopur" loading="lazy" width="1000" height="1000" /></figure><div className="about-image-badge"><strong>5,000+</strong><span>Policyholders<br />served with care</span></div></div>
        <div className="section-copy"><span className="section-tag">About your advisor</span><h2>About Mahesh Kumar Mathuria</h2>
          <p>Mahesh Kumar Mathuria ek experienced aur approachable Senior Life Insurance Advisor hain. 25+ saalon se woh Khandar, Sawai Madhopur aur nearby areas ki families ko life protection, savings, child future aur retirement needs samajhne mein personal guidance de rahe hain.</p>
          <p>Unka focus simple hai: policy benefits aur commitments ko easy Hindi mein samjhana, no-pressure consultation dena, aur policy review se claim documentation tak long-term support ke liye available rehna.</p>
          <ul className="check-list"><li><Icon name="check" /> 25+ years industry experience</li><li><Icon name="check" /> 5,000+ policyholders served</li><li><Icon name="check" /> 20+ advisor support team</li><li><Icon name="check" /> Simple Hindi explanations</li><li><Icon name="check" /> No-pressure personal consultation</li><li><Icon name="check" /> Khandar & Sawai Madhopur support</li></ul>
          <a className="text-link" href="#contact">Talk to Mahesh ji <Icon name="arrow" size={18} /></a>
        </div>
      </div></section>

      <section className="section services" id="services"><div className="container">
        <div className="section-heading centered"><span className="section-tag">Insurance solutions</span><h2>Insurance Planning Services</h2><p>Life insurance, retirement and child future planning se existing policy review aur claim assistance tak—clear, personal guidance.</p></div>
        <div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.title}><span className="service-number">0{index + 1}</span><div className="service-icon"><Icon name={service.icon} size={28} /></div><h3>{service.title}</h3><p>{service.text}</p><a href={whatsappLink(`Hello Mahesh Ji, I would like a free consultation about ${service.title}.`)} target="_blank" rel="noreferrer" aria-label={`WhatsApp about ${service.title}`}>Ask on WhatsApp <Icon name="arrow" size={16} /></a></article>)}</div>
      </div></section>

      <section className="section process" id="process"><div className="container process-grid">
        <div className="section-heading light"><span className="section-tag">Simple process</span><h2>25+ Years of<br /> <em>Trusted Guidance</em></h2><p>Koi confusing jargon nahi. Pehle aapki requirement, phir free discussion aur uske baad suitable guidance.</p><a className="button button-gold" href="#contact">Request a callback <Icon name="arrow" size={18} /></a></div>
        <div className="steps"><article><span>01</span><div><h3>Tell us your requirement</h3><p>Callback form fill karein ya WhatsApp par apni need share karein.</p></div></article><article><span>02</span><div><h3>Free consultation</h3><p>Family needs, goals, budget aur existing policies par short discussion.</p></div></article><article><span>03</span><div><h3>Personal guidance</h3><p>Aapki requirements ke according suitable options aur next steps samjhein.</p></div></article></div>
      </div></section>

      <section className="section why-us" id="why-us"><div className="container"><div className="section-heading centered compact"><span className="section-tag">Why choose Mahesh ji</span><h2>Why Choose Mahesh Ji</h2><p>Experience, accessibility and straightforward explanations—without misleading promises or pressure.</p></div><div className="why-grid">{whyPoints.map((point) => <article key={point.title}><span><Icon name={point.icon} /></span><div><h3>{point.title}</h3><p>{point.text}</p></div></article>)}</div></div></section>

      <section className="section faq-section" id="faq"><div className="container faq-grid">
        <div className="section-heading"><span className="section-tag">Common questions</span><h2>Frequently Asked<br /> <em>Questions</em></h2><p>Life insurance guidance in Khandar and Sawai Madhopur ke baare mein common questions.</p><a className="text-link" href={`tel:+${PHONE}`}>Call {DISPLAY_PHONE} <Icon name="arrow" size={18} /></a></div>
        <div className="faq-list">{faqs.map((faq, index) => <article className={openFaq === index ? "faq-item active" : "faq-item"} key={faq.q}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{faq.q}</span><b>{openFaq === index ? "−" : "+"}</b></button><div className="faq-answer"><p>{faq.a}</p></div></article>)}</div>
      </div></section>

      <section className="section contact" id="contact"><div className="container contact-grid">
        <div className="contact-copy"><span className="section-tag">Free callback</span><h2>Contact Mahesh Ji</h2><p>Short form fill karein. Website aapke liye ek professional WhatsApp message prepare karegi, jise send karke aap callback request complete kar sakte hain.</p>
          <div className="contact-details"><a href={`tel:+${PHONE}`}><span><Icon name="phone" /></span><div><small>Call directly</small><strong>{DISPLAY_PHONE}</strong></div></a><a href="mailto:mkmathuria10358@gmail.com"><span><Icon name="mail" /></span><div><small>Email</small><strong>mkmathuria10358@gmail.com</strong></div></a><a href={MAP_URL} target="_blank" rel="noreferrer"><span><Icon name="map" /></span><div><small>Office location</small><strong>Khandar, Sawai Madhopur, Rajasthan</strong></div></a></div>
        </div>
        <form className="lead-form" onSubmit={handleSubmit}>
          {submitted ? <div className="form-success" role="status"><span className="success-icon"><Icon name="check" size={28} /></span><span className="section-tag">Details prepared</span><h3>Thank you! One final step.</h3><p>WhatsApp par prepared message send karein, taaki Mahesh ji ya team aapki callback request receive kar sake.</p><a className="button button-primary submit-button" href={submittedWhatsAppUrl} target="_blank" rel="noreferrer"><Icon name="whatsapp" /> Continue on WhatsApp <Icon name="arrow" size={18} /></a><button className="edit-details" type="button" onClick={() => setSubmitted(false)}>Edit my details</button></div> : <>
            <div className="form-head"><span>Free consultation</span><h3>Request a callback</h3><p>Only essential details—takes less than a minute.</p></div>
            <div className="form-grid short-form"><label><span>Name *</span><input name="name" type="text" placeholder="Your full name" required autoComplete="name" /></label><label><span>Phone number *</span><input name="phone" type="tel" placeholder="10-digit number" required pattern="[0-9+ ]{10,14}" autoComplete="tel" /></label><label className="full"><span>Requirement *</span><select name="requirement" required defaultValue=""><option value="" disabled>Select your requirement</option><option>Life Insurance</option><option>Child Future Plan</option><option>Savings Plan</option><option>Retirement Planning</option><option>Existing Policy Review</option><option>Claim Assistance</option><option>Other</option></select></label><label className="full"><span>City <small>(optional)</small></span><input name="city" type="text" placeholder="Your city" autoComplete="address-level2" /></label></div>
            <button className="button button-primary submit-button" type="submit">Request Free Callback <Icon name="arrow" size={18} /></button><small className="privacy-note">No backend is connected. Your details remain in this form until you choose to send them through WhatsApp.</small>
          </>}
        </form>
      </div></section>

      <section className="location-section" aria-labelledby="location-title"><div className="container location-card"><div className="location-icon"><Icon name="map" size={32} /></div><div><span className="section-tag">Visit or contact us</span><h2 id="location-title">Life Insurance Guidance in Khandar & Sawai Madhopur</h2><p><strong>Mahesh Kumar Mathuria</strong><br />Senior Life Insurance Advisor<br />Khandar, Sawai Madhopur, Rajasthan</p></div><div className="location-actions"><a className="button button-primary" href={MAP_URL} target="_blank" rel="noreferrer"><Icon name="map" /> Get Directions</a><a className="button button-secondary" href={`tel:+${PHONE}`}><Icon name="phone" /> {DISPLAY_PHONE}</a></div></div></section>

      <footer><div className="container footer-grid"><div className="footer-about"><a className="brand footer-brand" href="#home"><span className="brand-mark"><img src="/mahesh-advisor-logo-192.png" alt="" width="192" height="192" /></span><span><strong>Mahesh Kumar Mathuria</strong><small>Senior Life Insurance Advisor</small></span></a><p>Personal guidance for life protection, savings, child future, retirement, policy review and claim assistance in Khandar and Sawai Madhopur.</p></div><div><h3>Quick links</h3><a href="#about">About</a><a href="#services">Services</a><a href="#why-us">Why choose us</a><a href="#faq">FAQ</a></div><div><h3>Contact</h3><a href={`tel:+${PHONE}`}>{DISPLAY_PHONE}</a><a href="mailto:mkmathuria10358@gmail.com">mkmathuria10358@gmail.com</a><a href={MAP_URL} target="_blank" rel="noreferrer">Khandar, Sawai Madhopur, Rajasthan</a></div><div><h3>Connect</h3><a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp Mahesh Ji</a><a href={MAP_URL} target="_blank" rel="noreferrer">Google Maps</a><a href="#contact">Free consultation</a></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Mahesh Kumar Mathuria. All rights reserved.</p><p className="disclaimer"><strong>Disclaimer:</strong> Information on this website is for general awareness and consultation purposes. Insurance benefits, eligibility, premiums and returns depend on the respective policy terms and conditions. Please review official policy documents before making any decision. This is not the official LIC website.</p></div></footer>

      <a className="floating-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp Mahesh Ji for free consultation"><Icon name="whatsapp" /><span>WhatsApp Mahesh Ji</span></a>
      <div className="mobile-actions" aria-label="Quick contact actions"><a href={`tel:+${PHONE}`}><Icon name="phone" /> Call Now</a><a href={whatsappLink()} target="_blank" rel="noreferrer"><Icon name="whatsapp" /> WhatsApp</a></div>
    </main>
  );
}
