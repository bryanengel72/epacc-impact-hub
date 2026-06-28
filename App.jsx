import React, { useState, useEffect, useRef } from "react";

// ============================================================
// EPACC Impact Hub — connected demo
// Three views: Marketing site · Donor give-now page · Admin dashboard
// Visual identity carried from the EPACC mockup:
//   navy #0B2545 · gold #D4A02A · kelly green #2E9E5B · cream cards
// Donation flow is visual-only (fake confirm).
// ============================================================

const C = {
  navy: "#0B2545",
  navyDeep: "#081B33",
  gold: "#D4A02A",
  goldSoft: "#F0D58A",
  green: "#2E9E5B",
  greenSoft: "#E4F3EA",
  ink: "#13233B",
  slate: "#5A6B82",
  line: "#E4E8EF",
  cloud: "#F6F8FB",
  white: "#FFFFFF",
};

const fontStack =
  '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const displayStack = '"Fraunces", "Georgia", serif';

// ---- shared demo data -------------------------------------
const CAMPAIGN = {
  school: "Lincoln High School",
  unit: "Athletics Department",
  title: "Athletic Field Project",
  goal: 100000,
  raised: 64250,
  donors: 232,
  monthly: 38,
  dates: "May 1, 2024 – Apr 30, 2025",
  daysLeft: 152,
};

const PRESETS = [25, 50, 100, 250, 500];

const RECENT = [
  { name: "John Smith", amt: 500, when: "2 hours ago", init: "JS" },
  { name: "Mary Green", amt: 250, when: "5 hours ago", init: "MG" },
  { name: "Anonymous", amt: 100, when: "Yesterday", init: "·" },
  { name: "Lisa White", amt: 100, when: "Yesterday", init: "LW" },
  { name: "Tom Parker", amt: 1000, when: "2 days ago", init: "TP" },
];

const TIERS = [
  {
    name: "Supporter",
    price: 12.99,
    perk: "Campaign updates and donor recognition",
  },
  { name: "Builder", price: 25, perk: "Recognition and event updates" },
  { name: "Champion", price: 50, perk: "Premium updates and sponsor offers" },
  {
    name: "Legacy Partner",
    price: 100,
    perk: "VIP recognition and campaign briefings",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$99",
    for: "One campaign or small school",
    feats: ["Campaign dashboard", "Donor + sponsor tracker", "Give-now page", "Weekly report"],
  },
  {
    name: "Growth",
    price: "$199",
    for: "Athletics, boosters, multiple campaigns",
    feats: [
      "Everything in Starter",
      "Gift pyramid tracker",
      "Alumni + parent outreach",
      "Recurring giving app",
    ],
    featured: true,
  },
  {
    name: "Pro",
    price: "$399",
    for: "Full school or athletic department",
    feats: [
      "Everything in Growth",
      "Multi-program dashboards",
      "Major-donor pipeline",
      "Board presentation kit",
    ],
  },
];

const usd = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// ============================================================
export default function App() {
  const [view, setView] = useState("home"); // home | give | admin
  const [live, setLive] = useState({ raised: CAMPAIGN.raised, donors: CAMPAIGN.donors });

  // a gift made on the donor page flows into the admin numbers
  const recordGift = (amt) =>
    setLive((s) => ({ raised: s.raised + amt, donors: s.donors + 1 }));

  return (
    <div style={{ fontFamily: fontStack, color: C.ink, background: C.cloud, minHeight: "100vh" }}>
      <FontLoader />
      <TopBar view={view} setView={setView} />
      {view === "home" && <Marketing setView={setView} />}
      {view === "give" && <Donate live={live} recordGift={recordGift} setView={setView} />}
      {view === "admin" && <Admin live={live} setView={setView} />}
      <Footer setView={setView} />
    </div>
  );
}

// ---- font + base ------------------------------------------
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      @keyframes rise { from { opacity:0; transform: translateY(14px);} to {opacity:1; transform:none;} }
      @keyframes grow { from { width: 0; } }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
      .lift { transition: transform .18s ease, box-shadow .18s ease; }
      .lift:hover { transform: translateY(-3px); }
      button:focus-visible, a:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    `}</style>
  );
}

// ---- top navigation ---------------------------------------
function TopBar({ view, setView }) {
  const tabs = [
    ["home", "Platform"],
    ["give", "Donor page"],
    ["admin", "School dashboard"],
  ];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: C.navy,
        borderBottom: `1px solid ${C.navyDeep}`,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <button
          onClick={() => setView("home")}
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}
          aria-label="EPACC Impact Hub home"
        >
          <Mark />
          <div style={{ textAlign: "left", lineHeight: 1 }}>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em" }}>
              EPACC
            </div>
            <div style={{ color: C.gold, fontWeight: 600, fontSize: 10, letterSpacing: "0.22em" }}>
              IMPACT HUB
            </div>
          </div>
        </button>
        <nav style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className="lift"
              style={{
                background: view === id ? "rgba(212,160,42,0.16)" : "transparent",
                color: view === id ? C.gold : "rgba(255,255,255,0.78)",
                border: "none",
                padding: "9px 15px",
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: fontStack,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Mark({ size = 34 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9,
        background: `linear-gradient(135deg, ${C.gold}, #B7831A)`,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18" stroke={C.navy} strokeWidth="2.4" strokeLinecap="round" />
        <rect x="4" y="13" width="3.4" height="6" rx="1" fill={C.navy} />
        <rect x="10.3" y="8" width="3.4" height="11" rx="1" fill={C.navy} />
        <rect x="16.6" y="4" width="3.4" height="15" rx="1" fill={C.navy} />
      </svg>
    </div>
  );
}

// ============================================================
// MARKETING SITE
// ============================================================
function Marketing({ setView }) {
  const pct = Math.round((CAMPAIGN.raised / CAMPAIGN.goal) * 100);
  return (
    <main>
      {/* hero */}
      <section style={{ background: C.navy, color: C.white, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 480px at 78% -8%, rgba(212,160,42,0.20), transparent 60%)",
          }}
        />
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "72px 24px 80px",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 56,
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ animation: "rise .6s ease both" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: C.gold,
                background: "rgba(212,160,42,0.12)",
                border: "1px solid rgba(212,160,42,0.3)",
                padding: "6px 12px",
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              FUNDRAISING COMMAND CENTER FOR SCHOOLS
            </span>
            <h1
              style={{
                fontFamily: displayStack,
                fontSize: 54,
                lineHeight: 1.04,
                fontWeight: 600,
                margin: "0 0 18px",
                letterSpacing: "-0.02em",
              }}
            >
              Stop fundraising randomly.
              <br />
              <span style={{ color: C.gold }}>Start building a system.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", maxWidth: 520, margin: "0 0 30px" }}>
              EPACC gives schools, athletic departments, and booster clubs the
              strategy, AI workflow, and donor-engagement app that usually only
              big institutions can afford. One platform, four services, real
              accountability.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Btn onClick={() => setView("give")}>See the donor experience</Btn>
              <Btn ghost onClick={() => setView("admin")}>
                Tour the dashboard
              </Btn>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 18 }}>
              We only earn a performance incentive if your campaign beats its goal.
            </p>
          </div>

          {/* hero signature: a living campaign card */}
          <div style={{ animation: "rise .7s ease .1s both" }}>
            <HeroCampaignCard pct={pct} />
          </div>
        </div>
      </section>

      {/* problem → solution band */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "70px 24px 20px" }}>
        <Eyebrow>THE GAP</Eyebrow>
        <h2 style={h2()}>Strong missions, scattered fundraising.</h2>
        <p style={{ ...lead(), maxWidth: 720 }}>
          Most schools have loyal families, alumni, former athletes, and local
          businesses ready to give. What they lack is the structure to turn those
          relationships into consistent revenue, so they fall back on one-time
          fundraisers.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
            gap: 18,
            marginTop: 36,
          }}
        >
          {[
            ["No donor database", "Relationships live in spreadsheets, inboxes, and memory."],
            ["No follow-up system", "Gifts get thanked late, or not at all."],
            ["No recurring strategy", "Every year starts the donor base from zero."],
            ["No live dashboard", "Leadership can't see progress until it's over."],
          ].map(([t, d]) => (
            <div key={t} style={card()}>
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>{t}</h3>
              <p style={{ margin: 0, color: C.slate, fontSize: 14, lineHeight: 1.5 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* four services */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px" }}>
        <Eyebrow>THE PLATFORM</Eyebrow>
        <h2 style={h2()}>Four services. One connected system.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 18,
            marginTop: 36,
          }}
        >
          {[
            ["01", "Fundraising consulting", "Strategy, gift pyramid, campaign calendar, and a 30/60/90-day plan built around your school."],
            ["02", "AI workflow tools", "Donor outreach, sponsorship letters, thank-yous, and weekly reports generated for you."],
            ["03", "Donor + sponsor tracking", "A live pipeline of every prospect, pledge, and recurring gift in one place."],
            ["04", "Donor engagement app", "A give-now page your community can rally around, with monthly giving built in."],
          ].map(([n, t, d]) => (
            <div key={n} className="lift" style={{ ...card(), borderTop: `3px solid ${C.gold}` }}>
              <div style={{ fontFamily: displayStack, fontSize: 30, color: C.gold, fontWeight: 600 }}>{n}</div>
              <h3 style={{ margin: "8px 0 8px", fontSize: 18, fontWeight: 700 }}>{t}</h3>
              <p style={{ margin: 0, color: C.slate, fontSize: 14.5, lineHeight: 1.55 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* shared-risk highlight (real differentiator) */}
      <section style={{ background: C.navy, color: C.white }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "60px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: C.gold }}>
              SHARED ACCOUNTABILITY
            </span>
            <h2 style={{ fontFamily: displayStack, fontSize: 38, fontWeight: 600, margin: "14px 0 16px", letterSpacing: "-0.02em" }}>
              We win when your campaign wins.
            </h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", maxWidth: 480 }}>
              EPACC earns a performance incentive only on dollars raised above
              your goal. If your school completes its obligations and the
              campaign still falls short, part of the planning retainer comes
              back to you. Your money never passes through us, it goes straight
              to your school or foundation account.
            </p>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              ["Goal", usd(CAMPAIGN.goal)],
              ["Raised in this campaign", usd(CAMPAIGN.raised)],
              ["EPACC incentive if you miss goal", "$0"],
              ["EPACC incentive on $40k over goal", "$3,050"],
            ].map(([k, v], i) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14.5 }}>{k}</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: i > 1 ? C.gold : C.white }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "70px 24px" }}>
        <Eyebrow>SUBSCRIPTION</Eyebrow>
        <h2 style={h2()}>Pricing that scales with your program.</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 18,
            marginTop: 36,
          }}
        >
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="lift"
              style={{
                ...card(),
                padding: 28,
                background: p.featured ? C.navy : C.white,
                color: p.featured ? C.white : C.ink,
                border: p.featured ? "none" : `1px solid ${C.line}`,
                position: "relative",
              }}
            >
              {p.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: -11,
                    left: 28,
                    background: C.gold,
                    color: C.navy,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    padding: "4px 11px",
                    borderRadius: 999,
                  }}
                >
                  MOST POPULAR
                </span>
              )}
              <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>{p.name}</h3>
              <div style={{ fontFamily: displayStack, fontSize: 40, fontWeight: 600 }}>
                {p.price}
                <span style={{ fontSize: 15, fontFamily: fontStack, opacity: 0.6, fontWeight: 500 }}>/mo</span>
              </div>
              <p style={{ fontSize: 13.5, opacity: 0.7, margin: "4px 0 18px" }}>{p.for}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {p.feats.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 9, fontSize: 14, alignItems: "flex-start" }}>
                    <Check color={p.featured ? C.gold : C.green} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ color: C.slate, fontSize: 13.5, marginTop: 18 }}>
          Larger schools, districts, and colleges: Enterprise from $750/mo. Most
          schools begin with a $2,500 launch package, then a monthly subscription.
        </p>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            background: `linear-gradient(120deg, ${C.green}, #1F7A44)`,
            borderRadius: 22,
            padding: "48px 40px",
            color: C.white,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <h2 style={{ fontFamily: displayStack, fontSize: 32, fontWeight: 600, margin: "0 0 8px" }}>
              Give your school a fundraising command center.
            </h2>
            <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.9)" }}>
              Walk through exactly what your donors and your team would see.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn onClick={() => setView("give")}>Open donor page</Btn>
            <Btn ghost light onClick={() => setView("admin")}>
              Open dashboard
            </Btn>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroCampaignCard({ pct }) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 20,
        padding: 26,
        boxShadow: "0 30px 70px rgba(3,12,28,0.45)",
        color: C.ink,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, color: C.slate, fontWeight: 600 }}>{CAMPAIGN.school}</div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{CAMPAIGN.title}</div>
        </div>
        <span style={{ background: C.greenSoft, color: C.green, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999 }}>
          LIVE
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: displayStack, fontSize: 38, fontWeight: 600 }}>{usd(CAMPAIGN.raised)}</span>
        <span style={{ color: C.slate, fontSize: 14 }}>of {usd(CAMPAIGN.goal)}</span>
      </div>
      <Bar pct={pct} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.slate, marginTop: 8 }}>
        <span>
          <strong style={{ color: C.green }}>{pct}%</strong> to goal
        </span>
        <span>
          <strong style={{ color: C.ink }}>{CAMPAIGN.donors}</strong> donors · {CAMPAIGN.daysLeft} days left
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 18 }}>
        {[
          [usd(277), "Avg gift"],
          [CAMPAIGN.monthly, "Monthly donors"],
          ["24", "Sponsors"],
        ].map(([v, l]) => (
          <div key={l} style={{ background: C.cloud, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{v}</div>
            <div style={{ fontSize: 11, color: C.slate }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DONOR GIVE-NOW PAGE
// ============================================================
function Donate({ live, recordGift, setView }) {
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [name, setName] = useState("");
  const [anon, setAnon] = useState(false);
  const [done, setDone] = useState(null); // holds the confirmed gift
  const [feed, setFeed] = useState(RECENT);

  const value = custom ? Math.max(0, Math.round(Number(custom) || 0)) : amount;
  const pct = Math.min(100, Math.round((live.raised / CAMPAIGN.goal) * 100));

  const give = () => {
    if (value <= 0) return;
    recordGift(value);
    const display = anon || !name.trim() ? "Anonymous" : name.trim();
    setFeed((f) => [
      { name: display, amt: value, when: "Just now", init: initials(display), fresh: true },
      ...f,
    ]);
    setDone({ amount: value, monthly, name: display });
  };

  if (done) {
    return (
      <ThankYou gift={done} setView={setView} reset={() => setDone(null)} />
    );
  }

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 24px 70px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 32, alignItems: "start" }}>
        {/* left: story + progress */}
        <section>
          <div
            style={{
              borderRadius: 18,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${C.navy}, ${C.navyDeep})`,
              color: C.white,
              padding: "30px 30px 28px",
            }}
          >
            <div style={{ fontSize: 13, color: C.goldSoft, fontWeight: 700, letterSpacing: "0.1em" }}>
              {CAMPAIGN.school.toUpperCase()} · {CAMPAIGN.unit.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: displayStack, fontSize: 36, fontWeight: 600, margin: "10px 0 6px", letterSpacing: "-0.02em" }}>
              {CAMPAIGN.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15.5, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              Help us build a field our athletes, families, and community can be
              proud of for the next generation. Every gift goes directly to the
              school and moves us closer to the goal.
            </p>

            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: displayStack, fontSize: 34, fontWeight: 600 }}>{usd(live.raised)}</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>raised of {usd(CAMPAIGN.goal)}</span>
              </div>
              <Bar pct={pct} dark />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "rgba(255,255,255,0.78)", marginTop: 8 }}>
                <span><strong style={{ color: C.goldSoft }}>{pct}%</strong> funded</span>
                <span><strong>{live.donors}</strong> donors · {CAMPAIGN.daysLeft} days left</span>
              </div>
            </div>
          </div>

          {/* donor wall */}
          <div style={{ ...card(), marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Recent supporters</h2>
              <span style={{ fontSize: 12, color: C.slate }}>Donor wall</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {feed.slice(0, 6).map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: d.fresh ? C.greenSoft : "transparent",
                    animation: d.fresh ? "rise .4s ease both" : "none",
                  }}
                >
                  <Avatar text={d.init} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: C.slate }}>{d.when}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: C.green }}>{usd(d.amt)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* right: give box */}
        <aside
          style={{
            ...card(),
            position: "sticky",
            top: 88,
            padding: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Make a gift</h2>
          <p style={{ fontSize: 13, color: C.slate, margin: "0 0 18px" }}>
            Choose an amount and how often you'd like to give.
          </p>

          {/* one-time / monthly toggle */}
          <div style={{ display: "flex", background: C.cloud, borderRadius: 11, padding: 4, marginBottom: 18 }}>
            {[
              [false, "One-time"],
              [true, "Monthly"],
            ].map(([val, label]) => (
              <button
                key={label}
                onClick={() => setMonthly(val)}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: fontStack,
                  cursor: "pointer",
                  background: monthly === val ? C.white : "transparent",
                  color: monthly === val ? C.navy : C.slate,
                  boxShadow: monthly === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* presets */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {PRESETS.map((p) => {
              const active = !custom && amount === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setAmount(p);
                    setCustom("");
                  }}
                  style={{
                    border: `1.5px solid ${active ? C.green : C.line}`,
                    background: active ? C.greenSoft : C.white,
                    color: active ? C.green : C.ink,
                    borderRadius: 10,
                    padding: "12px 0",
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: fontStack,
                    cursor: "pointer",
                  }}
                >
                  ${p}
                </button>
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1.5px solid ${custom ? C.green : C.line}`,
                borderRadius: 10,
                padding: "0 10px",
                background: custom ? C.greenSoft : C.white,
              }}
            >
              <span style={{ color: C.slate, fontWeight: 700 }}>$</span>
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="Other"
                inputMode="numeric"
                aria-label="Custom amount"
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: fontStack,
                  padding: "12px 2px",
                  outline: "none",
                  color: C.ink,
                }}
              />
            </div>
          </div>

          {/* name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={anon}
            aria-label="Your name"
            style={{
              width: "100%",
              border: `1.5px solid ${C.line}`,
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14.5,
              fontFamily: fontStack,
              marginTop: 8,
              outline: "none",
              color: C.ink,
              background: anon ? C.cloud : C.white,
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.slate, marginTop: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
            Give anonymously
          </label>

          <button
            onClick={give}
            disabled={value <= 0}
            className="lift"
            style={{
              width: "100%",
              marginTop: 18,
              background: value > 0 ? C.gold : C.line,
              color: value > 0 ? C.navy : C.slate,
              border: "none",
              borderRadius: 12,
              padding: "15px 0",
              fontSize: 16,
              fontWeight: 800,
              fontFamily: fontStack,
              cursor: value > 0 ? "pointer" : "not-allowed",
            }}
          >
            {value > 0
              ? `Give ${usd(value)}${monthly ? " / month" : ""}`
              : "Enter an amount"}
          </button>
          <p style={{ fontSize: 11.5, color: C.slate, textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
            Demo only — no payment is processed. Funds would go directly to{" "}
            {CAMPAIGN.school}, never through EPACC.
          </p>
        </aside>
      </div>
    </main>
  );
}

function ThankYou({ gift, setView, reset }) {
  return (
    <main style={{ maxWidth: 620, margin: "0 auto", padding: "70px 24px" }}>
      <div style={{ ...card(), padding: 40, textAlign: "center", animation: "rise .5s ease both" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: C.greenSoft,
            display: "grid",
            placeItems: "center",
            margin: "0 auto 22px",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontFamily: displayStack, fontSize: 30, fontWeight: 600, margin: "0 0 8px" }}>
          Thank you, {gift.name === "Anonymous" ? "friend" : gift.name.split(" ")[0]}!
        </h1>
        <p style={{ color: C.slate, fontSize: 16, margin: "0 0 4px" }}>
          Your {gift.monthly ? "monthly " : ""}gift of{" "}
          <strong style={{ color: C.green }}>{usd(gift.amount)}</strong> moves{" "}
          {CAMPAIGN.school} closer to the goal.
        </p>
        <p style={{ color: C.slate, fontSize: 13.5 }}>
          A receipt would be emailed to you. This is a demo, so no charge was made.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          <Btn onClick={reset}>Give again</Btn>
          <Btn ghost onClick={() => setView("admin")}>
            See it land on the dashboard
          </Btn>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function Admin({ live, setView }) {
  const remaining = Math.max(0, CAMPAIGN.goal - live.raised);
  const pct = Math.min(100, Math.round((live.raised / CAMPAIGN.goal) * 100));
  const pledged = 15000;

  const stats = [
    ["Goal", usd(CAMPAIGN.goal), "Total campaign goal", C.gold],
    ["Raised", usd(live.raised), "Total amount raised", C.green],
    ["Remaining", usd(remaining), "Amount remaining", C.slate],
    ["% of goal", `${pct}%`, "Progress to goal", C.navy],
    ["Days left", `${CAMPAIGN.daysLeft}`, "Days remaining", C.gold],
  ];

  const kpis = [
    [live.donors, "Donors", "Total donors", "+18 this month"],
    ["24", "Sponsors", "Total sponsors", "+3 this month"],
    ["15", "Pledges", "Total pledges", `${usd(pledged)} committed`],
    [usd(277), "Avg donation", "Average gift", "+$22 this month"],
    [CAMPAIGN.monthly, "Recurring", "Monthly donors", "$2,890 / month"],
  ];

  const tasks = [
    ["Follow up with 10 major donor prospects", "May 25", "In Progress"],
    ["Send thank-you emails to new donors", "May 18", "Completed"],
    ["Contact alumni class reps", "May 26", "In Progress"],
    ["Secure 2 new corporate sponsors", "May 30", "Pending"],
    ["Update social media campaign post", "May 22", "In Progress"],
  ];

  const sources = [
    ["Individual donations", 27450, C.green],
    ["Corporate sponsors", 21300, C.gold],
    ["Pledges", 15000, C.navy],
    ["Events", 550, C.slate],
  ];

  return (
    <main style={{ background: C.cloud, minHeight: "60vh" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 24px 70px" }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
          <div>
            <h1 style={{ fontFamily: displayStack, fontSize: 30, fontWeight: 600, margin: "0 0 4px" }}>
              Welcome back, Edward
            </h1>
            <p style={{ color: C.slate, margin: 0 }}>Here's what's happening with your campaign.</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: C.white,
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              padding: "10px 16px",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{CAMPAIGN.school}</div>
              <div style={{ fontSize: 12, color: C.slate }}>{CAMPAIGN.unit}</div>
            </div>
          </div>
        </div>

        {/* stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 18 }}>
          {stats.map(([label, val, sub, color]) => (
            <div key={label} style={card()}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: C.slate, textTransform: "uppercase" }}>
                {label}
              </div>
              <div style={{ fontFamily: displayStack, fontSize: 28, fontWeight: 600, color, margin: "6px 0 2px" }}>{val}</div>
              <div style={{ fontSize: 12.5, color: C.slate }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 18 }}>
          {/* progress ring */}
          <div style={card()}>
            <SectionTitle>Campaign progress</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 14 }}>
              <Ring pct={pct} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: displayStack, fontSize: 28, fontWeight: 600 }}>{usd(live.raised)}</div>
                <div style={{ color: C.slate, fontSize: 13, marginBottom: 14 }}>Raised of {usd(CAMPAIGN.goal)} goal</div>
                {[
                  ["Raised", usd(live.raised), C.green],
                  ["Committed (pledges)", usd(pledged), C.gold],
                  ["Remaining", usd(remaining), C.line],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, marginBottom: 7 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                    <span style={{ flex: 1, color: C.slate }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* fundraising by source */}
          <div style={card()}>
            <SectionTitle>Fundraising by source</SectionTitle>
            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              {sources.map(([label, amt, color]) => {
                const total = sources.reduce((s, x) => s + x[1], 0);
                const p = Math.round((amt / total) * 100);
                return (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                        {label}
                      </span>
                      <strong>{usd(amt)} <span style={{ color: C.slate, fontWeight: 500 }}>({p}%)</span></strong>
                    </div>
                    <div style={{ height: 7, background: C.cloud, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${p}%`, height: "100%", background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* kpi strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: 18 }}>
          {kpis.map(([val, label, sub, foot]) => (
            <div key={label} style={card()}>
              <div style={{ fontSize: 12, color: C.slate, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontFamily: displayStack, fontSize: 26, fontWeight: 600, margin: "4px 0 2px" }}>{val}</div>
              <div style={{ fontSize: 12, color: C.slate }}>{sub}</div>
              <div style={{ fontSize: 11.5, color: C.green, marginTop: 6, fontWeight: 600 }}>{foot}</div>
            </div>
          ))}
        </div>

        {/* tasks + update */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
          <div style={card()}>
            <SectionTitle>Campaign tasks</SectionTitle>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {tasks.map(([t, due, status]) => {
                const sc =
                  status === "Completed" ? C.green : status === "Pending" ? C.gold : C.navy;
                const sbg =
                  status === "Completed" ? C.greenSoft : status === "Pending" ? "#FBF1D8" : "#E8EEF7";
                return (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 12px",
                      border: `1px solid ${C.line}`,
                      borderRadius: 11,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${status === "Completed" ? C.green : C.line}`,
                        background: status === "Completed" ? C.green : "transparent",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {status === "Completed" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, textDecoration: status === "Completed" ? "line-through" : "none", color: status === "Completed" ? C.slate : C.ink }}>
                      {t}
                    </span>
                    <span style={{ fontSize: 12, color: C.slate }}>{due}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: sc, background: sbg, padding: "4px 9px", borderRadius: 999 }}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...card(), background: C.navy, color: C.white, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.gold }}>LATEST UPDATE</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, margin: "12px 0 auto", color: "rgba(255,255,255,0.9)" }}>
              We're {pct}% of the way to our goal. Thank you to all our amazing
              donors and supporters.
            </p>
            <button
              onClick={() => setView("give")}
              className="lift"
              style={{
                marginTop: 20,
                background: C.gold,
                color: C.navy,
                border: "none",
                borderRadius: 11,
                padding: "13px 0",
                fontSize: 15,
                fontWeight: 800,
                fontFamily: fontStack,
                cursor: "pointer",
              }}
            >
              Open donor page
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// shared bits
// ============================================================
function Btn({ children, onClick, ghost, light }) {
  const base = {
    border: "none",
    borderRadius: 11,
    padding: "13px 22px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: fontStack,
    cursor: "pointer",
  };
  if (ghost)
    return (
      <button
        onClick={onClick}
        className="lift"
        style={{
          ...base,
          background: "transparent",
          color: light ? C.white : C.gold,
          border: `1.5px solid ${light ? "rgba(255,255,255,0.6)" : C.gold}`,
        }}
      >
        {children}
      </button>
    );
  return (
    <button onClick={onClick} className="lift" style={{ ...base, background: C.gold, color: C.navy }}>
      {children}
    </button>
  );
}

function Bar({ pct, dark }) {
  return (
    <div style={{ height: 12, background: dark ? "rgba(255,255,255,0.16)" : C.cloud, borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${C.green}, #45BE78)`,
          borderRadius: 99,
          animation: "grow .8s ease both",
        }}
      />
    </div>
  );
}

function Ring({ pct }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" style={{ flexShrink: 0 }}>
      <circle cx="66" cy="66" r={r} fill="none" stroke={C.cloud} strokeWidth="14" />
      <circle
        cx="66"
        cy="66"
        r={r}
        fill="none"
        stroke={C.green}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={off}
        transform="rotate(-90 66 66)"
        style={{ transition: "stroke-dashoffset .8s ease" }}
      />
      <text x="66" y="62" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.ink} fontFamily={displayStack}>
        {pct}%
      </text>
      <text x="66" y="80" textAnchor="middle" fontSize="11" fill={C.slate} fontFamily={fontStack}>
        of goal
      </text>
    </svg>
  );
}

function Avatar({ text }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: C.navy,
        color: C.white,
        display: "grid",
        placeItems: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
}

function Check({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.slate, margin: 0 }}>
      {children}
    </h2>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: C.gold, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Footer({ setView }) {
  return (
    <footer style={{ background: C.navyDeep, color: "rgba(255,255,255,0.7)" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "34px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Mark size={30} />
          <div>
            <div style={{ color: C.white, fontWeight: 700 }}>EPACC Impact Hub</div>
            <div style={{ fontSize: 12 }}>Development. Engagement. Impact.</div>
          </div>
        </div>
        <div style={{ fontSize: 13 }}>
          Demo build · Funds always route directly to the school, never through EPACC.
        </div>
      </div>
    </footer>
  );
}

// helpers
function initials(name) {
  if (name === "Anonymous") return "·";
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
