import { useState } from "react";

const COLORS = {
  bg: "#080810",
  surface: "#0f0f1a",
  card: "#14141f",
  border: "#1e1e2e",
  gold: "#c9a84c",
  goldLight: "#e8c97a",
  goldDim: "#7a6030",
  text: "#e8e8f0",
  textDim: "#7a7a9a",
  textMuted: "#44445a",
  accent: "#6b3fa0",
  accentLight: "#9b6fd0",
  red: "#c0392b",
  green: "#1a7a4a",
};

const style = {
  app: {
    fontFamily: "'Inter', 'SF Pro Display', sans-serif",
    background: COLORS.bg,
    color: COLORS.text,
    minHeight: "100vh",
    maxWidth: 420,
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  },
  screen: { minHeight: "100vh", display: "flex", flexDirection: "column" },
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const VENUES = [
  {
    id: 1,
    name: "Boujee Mayfair",
    postcode: "W1J 6ER",
    area: "Mayfair",
    type: "Members Club",
    rating: 4.8,
    reviews: 142,
    nights: ["Friday Opulence", "Saturday Black Card"],
    cover: "£30",
    capacity: 400,
    about: "Mayfair's most exclusive members club. Three floors, rooftop terrace, resident DJs nightly.",
    upcomingNight: { name: "Friday Opulence", date: "Fri 20 Jun", dj: "DJ Camilla Rose" },
  },
  {
    id: 2,
    name: "Embargo Republica",
    postcode: "SW3 4SN",
    area: "Chelsea",
    type: "Nightclub",
    rating: 4.5,
    reviews: 98,
    nights: ["Latin Thursdays", "VIP Saturdays"],
    cover: "£20",
    capacity: 250,
    about: "Chelsea's go-to for Latin nights and premium spirits. Intimate dancefloor.",
    upcomingNight: { name: "Latin Thursdays", date: "Thu 19 Jun", dj: "DJ Marco S" },
  },
  {
    id: 3,
    name: "Mahiki",
    postcode: "W1J 5PU",
    area: "Mayfair",
    type: "Bar & Club",
    rating: 4.6,
    reviews: 210,
    nights: ["Treasure Room Fridays", "Sunday Sessions"],
    cover: "£25",
    capacity: 300,
    about: "Iconic Mayfair venue. Polynesian-themed cocktail bar and VIP booths.",
    upcomingNight: { name: "Treasure Room Fridays", date: "Fri 20 Jun", dj: "Resident" },
  },
];

const PROMOTERS = [
  {
    id: 1,
    name: "Marcus Bell",
    role: "Promoter",
    area: "Mayfair / Chelsea",
    rating: 4.9,
    reviews: 87,
    venues: ["Boujee Mayfair", "Mahiki"],
    guestlistOpen: true,
    experience: "8 years · ex-Annabel's, LouLou's",
    bio: "Specialist in HNW guest lists and corporate table bookings. Regular Friday residency at Boujee.",
    perGuest: "£5",
    retainer: "£800/night",
  },
  {
    id: 2,
    name: "Jade Okonkwo",
    role: "Promoter",
    area: "Shoreditch / Mayfair",
    rating: 4.7,
    reviews: 54,
    venues: ["Embargo Republica"],
    guestlistOpen: true,
    experience: "5 years · Fabric, Village Underground",
    bio: "Focused on creative industry crowd and brand partnership nights.",
    perGuest: "£4",
    retainer: "£600/night",
  },
  {
    id: 3,
    name: "Sophia Reyes",
    role: "Bottle Girl",
    area: "Mayfair",
    rating: 5.0,
    reviews: 31,
    venues: ["Boujee Mayfair", "Mahiki"],
    guestlistOpen: false,
    experience: "3 years · Boujee, Libertine",
    bio: "Premium bottle service specialist. Fluent in English, Spanish, French.",
    perGuest: "N/A",
    retainer: "£350/night + tips",
  },
];

const MESSAGES = {
  guest: [
    { id: 1, from: "Marcus Bell", preview: "Your spot on Friday's list is confirmed ✓", time: "2h ago", unread: true },
    { id: 2, from: "Boujee Mayfair", preview: "Thank you for your review!", time: "1d ago", unread: false },
  ],
  staff: [
    { id: 1, from: "Boujee Mayfair", preview: "Contract sent for Friday 20 Jun — please sign", time: "1h ago", unread: true },
    { id: 2, from: "Alex Guest", preview: "Can you add +2 to the list?", time: "3h ago", unread: true },
  ],
  venue: [
    { id: 1, from: "Marcus Bell", preview: "Guestlist ready — 47 confirmed for Friday", time: "30m ago", unread: true },
    { id: 2, from: "Sophia Reyes", preview: "Accepted your booking for Sat 21st", time: "2h ago", unread: false },
  ],
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const GoldLine = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, margin: "16px 0" }} />
);

const Badge = ({ label, color = COLORS.gold }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 4, padding: "2px 7px",
  }}>{label}</span>
);

const Stars = ({ rating }) => (
  <span style={{ color: COLORS.gold, fontSize: 12 }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    <span style={{ color: COLORS.textDim, marginLeft: 4 }}>{rating}</span>
  </span>
);

const Btn = ({ children, onClick, variant = "gold", small, style: s }) => {
  const base = {
    padding: small ? "8px 16px" : "14px 20px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: small ? 12 : 14,
    letterSpacing: 0.5,
    cursor: "pointer",
    border: "none",
    width: s?.width,
    transition: "opacity 0.15s",
    ...s,
  };
  const variants = {
    gold: { background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, color: "#080810" },
    outline: { background: "transparent", color: COLORS.gold, border: `1px solid ${COLORS.gold}` },
    ghost: { background: COLORS.border, color: COLORS.text },
    danger: { background: COLORS.red + "22", color: COLORS.red, border: `1px solid ${COLORS.red}44` },
    purple: { background: COLORS.accent, color: "#fff" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick}>{children}</button>;
};

const Input = ({ placeholder, value, onChange, type = "text", multiline }) => {
  const base = {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "12px 14px",
    color: COLORS.text,
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    resize: "none",
  };
  return multiline
    ? <textarea rows={3} style={base} placeholder={placeholder} value={value} onChange={onChange} />
    : <input type={type} style={base} placeholder={placeholder} value={value} onChange={onChange} />;
};

const Card = ({ children, onClick, style: s }) => (
  <div onClick={onClick} style={{
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 16,
    cursor: onClick ? "pointer" : "default",
    transition: "border-color 0.15s",
    ...s,
  }}>{children}</div>
);

const Avatar = ({ name, size = 44 }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.gold})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>{initials}</div>
  );
};

const TopBar = ({ title, onBack, rightEl }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`,
    background: COLORS.bg, position: "sticky", top: 0, zIndex: 10,
  }}>
    {onBack
      ? <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 20, cursor: "pointer", padding: 0 }}>←</button>
      : <div style={{ width: 24 }} />}
    <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>{title}</span>
    {rightEl || <div style={{ width: 24 }} />}
  </div>
);

const BottomNav = ({ tabs, active, onSelect }) => (
  <div style={{
    display: "flex", borderTop: `1px solid ${COLORS.border}`,
    background: COLORS.bg, position: "sticky", bottom: 0,
  }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onSelect(t.id)} style={{
        flex: 1, background: "none", border: "none", padding: "12px 0 10px",
        cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      }}>
        <span style={{ fontSize: 18 }}>{t.icon}</span>
        <span style={{ fontSize: 10, color: active === t.id ? COLORS.gold : COLORS.textDim, fontWeight: active === t.id ? 700 : 400 }}>{t.label}</span>
      </button>
    ))}
  </div>
);

const Toast = ({ msg, onClose }) => (
  <div style={{
    position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
    background: COLORS.green, color: "#fff", borderRadius: 8, padding: "10px 18px",
    fontSize: 13, fontWeight: 600, zIndex: 999, whiteSpace: "nowrap",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  }}>✓ {msg}</div>
);

// ─── LANDING ─────────────────────────────────────────────────────────────────

const Landing = ({ onSelect }) => (
  <div style={{ ...style.screen, justifyContent: "center", alignItems: "center", padding: 32, gap: 0 }}>
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", marginBottom: 12 }}>London's Private Nightlife Network</div>
      <div style={{
        fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1,
        background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold}, ${COLORS.accentLight})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>NIGHTLIST</div>
      <GoldLine />
      <div style={{ color: COLORS.textDim, fontSize: 14 }}>Where do you belong tonight?</div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {[
        { role: "guest", icon: "🥂", label: "Guest", sub: "Discover venues, join guestlists" },
        { role: "staff", icon: "🎧", label: "Staff", sub: "Promoters, bottle girls & dancers" },
        { role: "venue", icon: "🏛️", label: "Venue", sub: "List your space, book talent" },
      ].map(r => (
        <Card key={r.role} onClick={() => onSelect(r.role)} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>{r.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{r.label}</div>
            <div style={{ color: COLORS.textDim, fontSize: 13 }}>{r.sub}</div>
          </div>
          <span style={{ marginLeft: "auto", color: COLORS.gold, fontSize: 18 }}>→</span>
        </Card>
      ))}
    </div>

    <div style={{ marginTop: 32, fontSize: 11, color: COLORS.textMuted, textAlign: "center" }}>
      By continuing you agree to our Terms & Privacy Policy
    </div>
  </div>
);

// ─── AUTH (shared) ────────────────────────────────────────────────────────────

const Auth = ({ role, onDone, onBack }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [step, setStep] = useState(1);

  const roleLabel = role === "guest" ? "Guest" : role === "staff" ? "Staff" : "Venue";

  const handleContinue = () => {
    if (mode === "login" || step === 2) { onDone(); return; }
    setStep(2);
  };

  return (
    <div style={style.screen}>
      <TopBar title={`${roleLabel} ${mode === "login" ? "Sign In" : "Create Profile"}`} onBack={onBack} />
      <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {mode === "signup" && step === 1 && (
          <>
            <div style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 4 }}>Step 1 of 2 — Basic info</div>
            <Input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </>
        )}
        {mode === "signup" && step === 2 && role === "staff" && (
          <>
            <div style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 4 }}>Step 2 of 2 — Work profile</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>Role</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Promoter", "Bottle Girl", "Dancer", "DJ"].map(r => (
                <Badge key={r} label={r} color={COLORS.accentLight} />
              ))}
            </div>
            <Input placeholder="Years of experience" />
            <Input placeholder="Previous venues (e.g. Annabel's, LouLou's)" multiline />
            <Input placeholder="Expected retainer per night (£)" />
            <Input placeholder="Rate per guest on guestlist (£)" />
          </>
        )}
        {mode === "signup" && step === 2 && role === "venue" && (
          <>
            <div style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 4 }}>Step 2 of 2 — Venue details</div>
            <Input placeholder="Venue name" />
            <Input placeholder="Postcode (e.g. W1J 6ER)" />
            <Input placeholder="Venue type (club, bar, members club...)" />
            <Input placeholder="Capacity" />
            <Input placeholder="About your venue" multiline />
          </>
        )}
        {mode === "signup" && step === 2 && role === "guest" && (
          <>
            <div style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 4 }}>Step 2 of 2 — Your profile</div>
            <Input placeholder="Bio (optional)" multiline />
            <Input placeholder="Favourite areas (Mayfair, Chelsea...)" />
          </>
        )}
        {mode === "login" && (
          <>
            <Input placeholder="Email address" />
            <Input placeholder="Password" type="password" />
            <div style={{ color: COLORS.gold, fontSize: 13, textAlign: "right", cursor: "pointer" }}>Forgot password?</div>
          </>
        )}

        <Btn onClick={handleContinue} style={{ marginTop: 8 }}>
          {mode === "login" ? "Sign In" : step === 1 ? "Next →" : "Create Profile"}
        </Btn>

        <div style={{ textAlign: "center", color: COLORS.textDim, fontSize: 13 }}>
          {mode === "login" ? "No account? " : "Have an account? "}
          <span style={{ color: COLORS.gold, cursor: "pointer" }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setStep(1); }}>
            {mode === "login" ? "Create profile" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── MESSAGING ───────────────────────────────────────────────────────────────

const MessagingScreen = ({ role, onBack }) => {
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState([
    { from: "them", text: "Hey, your guestlist spot for Friday is confirmed." },
    { from: "me", text: "Amazing, thank you! Can I add a plus one?" },
  ]);

  const convos = MESSAGES[role] || [];

  if (active !== null) {
    const convo = convos[active];
    return (
      <div style={{ ...style.screen }}>
        <TopBar title={convo.from} onBack={() => setActive(null)} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {thread.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
              <div style={{
                background: m.from === "me" ? COLORS.gold : COLORS.card,
                color: m.from === "me" ? "#080810" : COLORS.text,
                borderRadius: 12, padding: "10px 14px", maxWidth: "75%", fontSize: 14,
              }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 10 }}>
          <Input placeholder="Message..." value={draft} onChange={e => setDraft(e.target.value)} />
          <Btn small onClick={() => { if (draft.trim()) { setThread([...thread, { from: "me", text: draft }]); setDraft(""); } }}>Send</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={style.screen}>
      <TopBar title="Messages" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {convos.map((c, i) => (
          <Card key={c.id} onClick={() => setActive(i)} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name={c.from} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{c.from}</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>{c.time}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textDim, marginTop: 2 }}>{c.preview}</div>
            </div>
            {c.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.gold, flexShrink: 0 }} />}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── REVIEW MODAL ────────────────────────────────────────────────────────────

const ReviewModal = ({ target, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
      <div style={{ background: COLORS.surface, borderRadius: "16px 16px 0 0", padding: 24, width: "100%", boxSizing: "border-box" }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Review {target}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} onClick={() => setRating(n)} style={{ fontSize: 28, cursor: "pointer", color: n <= rating ? COLORS.gold : COLORS.border }}>★</span>
          ))}
        </div>
        <Input placeholder="Share your experience..." value={text} onChange={e => setText(e.target.value)} multiline />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Btn variant="ghost" small onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn small onClick={() => onSubmit(rating, text)} style={{ flex: 1 }}>Submit Review</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── GUEST PORTAL ────────────────────────────────────────────────────────────

const GuestPortal = ({ onBack }) => {
  const [tab, setTab] = useState("explore");
  const [detail, setDetail] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [toast, setToast] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [copied, setCopied] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const copyPostcode = (postcode, venueId) => {
    navigator.clipboard.writeText(postcode).catch(() => {});
    setCopied(venueId);
    setTimeout(() => setCopied(null), 2000);
  };

  if (showMessages) return <MessagingScreen role="guest" onBack={() => setShowMessages(false)} />;

  if (detail && detailType === "venue") {
    const v = detail;
    return (
      <div style={style.screen}>
        <TopBar title={v.name} onBack={() => setDetail(null)} />
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <Badge label={v.type} />
            <Badge label={v.area} color={COLORS.accentLight} />
          </div>
          <Stars rating={v.rating} />
          <span style={{ color: COLORS.textDim, fontSize: 12, marginLeft: 8 }}>{v.reviews} reviews</span>
          <GoldLine />
          <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 16 }}>{v.about}</div>

          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>LOCATION</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{v.postcode}</div>
                <div style={{ fontSize: 12, color: COLORS.textDim }}>{v.area}, London</div>
              </div>
              <Btn small variant="outline" onClick={() => copyPostcode(v.postcode, v.id)}>
                {copied === v.id ? "✓ Copied" : "Copy for Maps"}
              </Btn>
            </div>
          </Card>

          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>UPCOMING NIGHT</div>
            <div style={{ fontWeight: 700 }}>{v.upcomingNight.name}</div>
            <div style={{ color: COLORS.textDim, fontSize: 13 }}>{v.upcomingNight.date} · {v.upcomingNight.dj}</div>
            <div style={{ marginTop: 10 }}>
              <Btn small onClick={() => showToast("Guestlist request sent!")}>Request Guestlist Spot</Btn>
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>DETAILS</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: COLORS.textDim }}>Cover charge</span><span>{v.cover}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 6 }}>
              <span style={{ color: COLORS.textDim }}>Capacity</span><span>{v.capacity}</span>
            </div>
          </Card>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" small onClick={() => showToast("Message sent!")} style={{ flex: 1 }}>Message Venue</Btn>
            <Btn variant="ghost" small onClick={() => setReviewTarget(v.name)} style={{ flex: 1 }}>Leave Review</Btn>
          </div>
        </div>
        {reviewTarget && (
          <ReviewModal target={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={() => { setReviewTarget(null); showToast("Review submitted!"); }} />
        )}
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  if (detail && detailType === "promoter") {
    const p = detail;
    return (
      <div style={style.screen}>
        <TopBar title={p.name} onBack={() => setDetail(null)} />
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <Avatar name={p.name} size={60} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
              <Badge label={p.role} />
              <div style={{ marginTop: 4 }}><Stars rating={p.rating} /></div>
            </div>
          </div>
          <GoldLine />
          <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6, marginBottom: 12 }}>{p.bio}</div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>EXPERIENCE</div>
            <div style={{ fontSize: 14 }}>{p.experience}</div>
          </Card>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>VENUES</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.venues.map(v => <Badge key={v} label={v} color={COLORS.accentLight} />)}
            </div>
          </Card>
          {p.guestlistOpen && (
            <Card style={{ marginBottom: 16, border: `1px solid ${COLORS.gold}44` }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>🟢 Guestlist Open</div>
              <Btn onClick={() => showToast("Guestlist request sent to " + p.name)}>Request Guestlist Spot</Btn>
            </Card>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" small onClick={() => showToast("Message sent!")} style={{ flex: 1 }}>Message</Btn>
            <Btn variant="ghost" small onClick={() => setReviewTarget(p.name)} style={{ flex: 1 }}>Leave Review</Btn>
          </div>
        </div>
        {reviewTarget && (
          <ReviewModal target={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={() => { setReviewTarget(null); showToast("Review submitted!"); }} />
        )}
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  const tabs = [
    { id: "explore", icon: "🔍", label: "Explore" },
    { id: "promoters", icon: "🎟️", label: "Promoters" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={style.screen}>
      <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase" }}>Nightlist</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Good evening 🥂</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "explore" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Venues Tonight</div>
            {VENUES.map(v => (
              <Card key={v.id} onClick={() => { setDetail(v); setDetailType("venue"); }} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 2 }}>{v.area} · {v.postcode}</div>
                    <div style={{ marginTop: 6 }}><Stars rating={v.rating} /></div>
                  </div>
                  <Badge label={v.type} />
                </div>
                <GoldLine />
                <div style={{ fontSize: 13, color: COLORS.gold }}>🎵 {v.upcomingNight.name} — {v.upcomingNight.date}</div>
              </Card>
            ))}
          </div>
        )}

        {tab === "promoters" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Staff & Promoters</div>
            {PROMOTERS.map(p => (
              <Card key={p.id} onClick={() => { setDetail(p); setDetailType("promoter"); }} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar name={p.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim }}>{p.role} · {p.area}</div>
                    <div style={{ marginTop: 4 }}><Stars rating={p.rating} /></div>
                  </div>
                  {p.guestlistOpen && <Badge label="List Open" color={COLORS.green} />}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "messages" && <MessagingScreen role="guest" onBack={() => setTab("explore")} />}

        {tab === "profile" && (
          <div style={{ padding: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar name="Alex Guest" size={80} />
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>Alex Guest</div>
              <div style={{ color: COLORS.textDim, fontSize: 13 }}>Member since Jun 2025</div>
              <div style={{ marginTop: 8 }}><Badge label="Guest" /></div>
            </div>
            <GoldLine />
            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>FAVOURITE AREAS</div>
              <div>Mayfair, Chelsea, Knightsbridge</div>
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>GUESTLIST HISTORY</div>
              <div style={{ fontSize: 14, color: COLORS.textDim }}>3 confirmed · 1 pending</div>
            </Card>
            <Btn variant="outline" small onClick={onBack} style={{ width: "100%" }}>Sign Out</Btn>
          </div>
        )}
      </div>

      <BottomNav tabs={tabs} active={tab} onSelect={setTab} />
      {toast && <Toast msg={toast} />}
    </div>
  );
};

// ─── STAFF PORTAL ────────────────────────────────────────────────────────────

const StaffPortal = ({ onBack }) => {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [guestlistOpen, setGuestlistOpen] = useState(false);
  const [showContract, setShowContract] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "guestlist", icon: "📋", label: "Guestlist" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={style.screen}>
      <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase" }}>Nightlist · Staff</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Marcus Bell 🎧</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "dashboard" && (
          <div style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Upcoming Gigs", value: "3" },
                { label: "Guests Tonight", value: "47" },
                { label: "Earnings (Jun)", value: "£2,400" },
                { label: "Rating", value: "4.9 ★" },
              ].map(s => (
                <Card key={s.label}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold, marginTop: 4 }}>{s.value}</div>
                </Card>
              ))}
            </div>

            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Upcoming Bookings</div>
            {[
              { venue: "Boujee Mayfair", night: "Friday Opulence", date: "Fri 20 Jun", status: "confirmed" },
              { venue: "Mahiki", night: "Treasure Room", date: "Sat 21 Jun", status: "pending" },
            ].map((b, i) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{b.venue}</div>
                <div style={{ fontSize: 13, color: COLORS.textDim }}>{b.night} · {b.date}</div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge label={b.status} color={b.status === "confirmed" ? COLORS.green : COLORS.gold} />
                  {b.status === "confirmed" && (
                    <Btn small variant="outline" onClick={() => setShowContract(true)}>View Contract</Btn>
                  )}
                </div>
              </Card>
            ))}

            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 10px" }}>Payment Settings</div>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: COLORS.textDim }}>Per guest rate</span><span style={{ fontWeight: 700 }}>£5.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: COLORS.textDim }}>Retainer</span><span style={{ fontWeight: 700 }}>£800/night</span>
              </div>
              <Btn small variant="ghost" onClick={() => showToast("Payment settings updated")} style={{ marginTop: 12, width: "100%" }}>
                Update Rates
              </Btn>
            </Card>
          </div>
        )}

        {tab === "guestlist" && (
          <div style={{ padding: 16 }}>
            <Card style={{ marginBottom: 16, border: `1px solid ${guestlistOpen ? COLORS.gold : COLORS.border}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Friday Guestlist</div>
                  <div style={{ fontSize: 13, color: COLORS.textDim }}>Boujee Mayfair · 20 Jun</div>
                </div>
                <Btn small variant={guestlistOpen ? "danger" : "gold"} onClick={() => {
                  setGuestlistOpen(!guestlistOpen);
                  showToast(guestlistOpen ? "Guestlist closed" : "Guestlist opened — awaiting venue confirmation");
                }}>
                  {guestlistOpen ? "Close List" : "Open List"}
                </Btn>
              </div>
              {guestlistOpen && (
                <div style={{ marginTop: 10 }}>
                  <Badge label="Awaiting venue confirmation" color={COLORS.gold} />
                </div>
              )}
            </Card>

            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
              Guest Requests ({guestlistOpen ? "4" : "0"})
            </div>

            {guestlistOpen && [
              { name: "Alex Thompson", plus: 1 },
              { name: "Priya Mehta", plus: 0 },
              { name: "James R.", plus: 2 },
              { name: "Sofia Blanc", plus: 1 },
            ].map((g, i) => (
              <Card key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  {g.plus > 0 && <div style={{ fontSize: 12, color: COLORS.textDim }}>+{g.plus}</div>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small variant="ghost" onClick={() => showToast(g.name + " declined")}>✗</Btn>
                  <Btn small onClick={() => showToast(g.name + " confirmed ✓")}>✓</Btn>
                </div>
              </Card>
            ))}

            {!guestlistOpen && (
              <div style={{ textAlign: "center", color: COLORS.textMuted, padding: 32, fontSize: 14 }}>
                Open your guestlist to start receiving requests
              </div>
            )}
          </div>
        )}

        {tab === "messages" && <MessagingScreen role="staff" onBack={() => setTab("dashboard")} />}

        {tab === "profile" && (
          <div style={{ padding: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Avatar name="Marcus Bell" size={80} />
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>Marcus Bell</div>
              <div style={{ color: COLORS.textDim, fontSize: 13 }}>Promoter · Mayfair / Chelsea</div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 6 }}>
                <Badge label="Promoter" />
                <Badge label="Verified" color={COLORS.green} />
              </div>
            </div>
            <GoldLine />
            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>EXPERIENCE</div>
              <div style={{ fontSize: 14 }}>8 years · ex-Annabel's, LouLou's</div>
            </Card>
            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>REGULAR VENUES</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge label="Boujee Mayfair" color={COLORS.accentLight} />
                <Badge label="Mahiki" color={COLORS.accentLight} />
              </div>
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>BIO</div>
              <div style={{ fontSize: 14, color: COLORS.textDim }}>Specialist in HNW guest lists and corporate table bookings.</div>
            </Card>
            <Btn variant="outline" small onClick={onBack} style={{ width: "100%" }}>Sign Out</Btn>
          </div>
        )}
      </div>

      <BottomNav tabs={tabs} active={tab} onSelect={setTab} />
      {toast && <Toast msg={toast} />}

      {showContract && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div style={{ background: COLORS.surface, borderRadius: "16px 16px 0 0", padding: 24, width: "100%", boxSizing: "border-box", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Staff Contract</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 16 }}>Boujee Mayfair · Friday 20 Jun 2025</div>
            <GoldLine />
            <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.8 }}>
              <p>This agreement is between <strong>Boujee Mayfair Ltd</strong> and <strong>Marcus Bell</strong> ("the Promoter").</p>
              <p><strong>Event:</strong> Friday Opulence — 20 June 2025</p>
              <p><strong>Retainer:</strong> £800 payable by midnight Sunday following the event</p>
              <p><strong>Per guest rate:</strong> £5.00 per confirmed guestlist arrival, verified by door count</p>
              <p><strong>Obligations:</strong> Promoter to deliver minimum 30 confirmed guests. Guestlist to be submitted via Nightlist app by 6pm on event day.</p>
              <p><strong>Bonus:</strong> £200 bonus payable for 50+ confirmed arrivals</p>
            </div>
            <GoldLine />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>DIGITAL SIGNATURE</div>
              <Input placeholder="Type your full name to sign" />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" small onClick={() => setShowContract(false)} style={{ flex: 1 }}>Close</Btn>
              <Btn small onClick={() => { setShowContract(false); showToast("Contract signed!"); }} style={{ flex: 1 }}>Sign & Confirm</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── VENUE PORTAL ────────────────────────────────────────────────────────────

const VenuePortal = ({ onBack }) => {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [showBook, setShowBook] = useState(null);
  const [showContractSend, setShowContractSend] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "staff", icon: "🎟️", label: "Book Staff" },
    { id: "nights", icon: "🌙", label: "My Nights" },
    { id: "messages", icon: "💬", label: "Messages" },
  ];

  return (
    <div style={style.screen}>
      <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase" }}>Nightlist · Venue</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Boujee Mayfair 🏛️</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "dashboard" && (
          <div style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Guestlist Tonight", value: "47" },
                { label: "Staff Booked", value: "4" },
                { label: "Revenue (Jun)", value: "£18,200" },
                { label: "Avg. Rating", value: "4.8 ★" },
              ].map(s => (
                <Card key={s.label}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold, marginTop: 4 }}>{s.value}</div>
                </Card>
              ))}
            </div>

            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Active Guestlists</div>
            {PROMOTERS.filter(p => p.guestlistOpen).map(p => (
              <Card key={p.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.textDim }}>Requests guestlist approval</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small variant="ghost" onClick={() => showToast(p.name + "'s list declined")}>✗</Btn>
                    <Btn small onClick={() => showToast(p.name + "'s list approved ✓")}>✓</Btn>
                  </div>
                </div>
              </Card>
            ))}

            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 10px" }}>Venue Info</div>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: COLORS.textDim }}>Postcode</span><span>W1J 6ER</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: COLORS.textDim }}>Capacity</span><span>400</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: COLORS.textDim }}>Listing status</span><Badge label="Live" color={COLORS.green} />
              </div>
            </Card>
          </div>
        )}

        {tab === "staff" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Available Staff</div>
            {PROMOTERS.map(p => (
              <Card key={p.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar name={p.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim }}>{p.role} · {p.experience}</div>
                    <Stars rating={p.rating} />
                  </div>
                </div>
                <GoldLine />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: COLORS.textDim }}>Retainer</span>
                  <span style={{ fontWeight: 700 }}>{p.retainer}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small variant="outline" onClick={() => showToast("Message sent to " + p.name)} style={{ flex: 1 }}>Message</Btn>
                  <Btn small onClick={() => setShowBook(p)} style={{ flex: 1 }}>Book Now</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "nights" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Promoted Nights</div>
            {VENUES[0].nights.map((n, i) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{n}</div>
                <div style={{ fontSize: 13, color: COLORS.textDim, marginTop: 4 }}>{i === 0 ? "Every Friday" : "Every Saturday"} · Cover {VENUES[0].cover}</div>
                <GoldLine />
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small variant="ghost" onClick={() => showToast("Night details updated")} style={{ flex: 1 }}>Edit</Btn>
                  <Btn small variant="outline" onClick={() => showToast("Night promoted to guests!")} style={{ flex: 1 }}>Promote</Btn>
                </div>
              </Card>
            ))}
            <Btn variant="ghost" onClick={() => showToast("New night created!")} style={{ width: "100%", marginTop: 8 }}>+ Add New Night</Btn>
          </div>
        )}

        {tab === "messages" && <MessagingScreen role="venue" onBack={() => setTab("dashboard")} />}
      </div>

      <BottomNav tabs={tabs} active={tab} onSelect={setTab} />
      {toast && <Toast msg={toast} />}

      {showBook && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div style={{ background: COLORS.surface, borderRadius: "16px 16px 0 0", padding: 24, width: "100%", boxSizing: "border-box" }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Book {showBook.name}</div>
            <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 16 }}>{showBook.role} · Retainer: {showBook.retainer}</div>
            <GoldLine />
            <div style={{ marginBottom: 12 }}>
              <Input placeholder="Event / night name" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Input placeholder="Date (e.g. Fri 20 Jun)" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input placeholder="Special requirements (optional)" multiline />
            </div>
            <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 16 }}>
              A contract will be auto-generated and sent to {showBook.name} for digital signature.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" small onClick={() => setShowBook(null)} style={{ flex: 1 }}>Cancel</Btn>
              <Btn small onClick={() => { setShowBook(null); showToast("Booking sent + contract issued!"); }} style={{ flex: 1 }}>Send Booking + Contract</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole] = useState(null);
  const [authed, setAuthed] = useState(false);

  const selectRole = (r) => { setRole(r); setScreen("auth"); };
  const onAuthed = () => { setAuthed(true); setScreen("portal"); };
  const goBack = () => { setScreen("landing"); setRole(null); setAuthed(false); };

  return (
    <div style={style.app}>
      {screen === "landing" && <Landing onSelect={selectRole} />}
      {screen === "auth" && <Auth role={role} onDone={onAuthed} onBack={goBack} />}
      {screen === "portal" && role === "guest" && <GuestPortal onBack={goBack} />}
      {screen === "portal" && role === "staff" && <StaffPortal onBack={goBack} />}
      {screen === "portal" && role === "venue" && <VenuePortal onBack={goBack} />}
    </div>
  );
}
