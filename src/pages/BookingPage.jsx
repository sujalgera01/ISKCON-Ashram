import React, { useState } from "react";

const LOGO_WHITE = "data:image/png;base64,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";
const translations = {
  en: {
    nav: { home: "Home", booking: "Book a Stay", rules: "Ashram Rules", contact: "Contact" },
    hero: { title: "Mataji Ashram", subtitle: "ISKCON Tokyo", tagline: "A sacred space for devotion, service & spiritual growth" },
    steps: ["Stay Details", "Guest Info", "Purpose of Visit", "Review & Pay"],
    stay: {
      title: "Select Your Stay",
      checkin: "Check-in Date", checkout: "Check-out Date",
      nights: "night", nights_plural: "nights",
      available: "Available", unavailable: "Unavailable",
      summary: "Stay Summary",
      total: "Total Amount", deposit: "Deposit Due Now (50%)", balance: "Balance Due on Arrival",
      select_room: "Assigned Accommodations",
      room1: "Room 1 — Vrindavan", room2: "Room 2 — Mayapur",
      max_stay: "Maximum stay is 30 days",
      guests_count: "Number of Guests (Devotees)",
      rooms_count: "Rooms Required",
      pricing_notice_seva: "Seva Rate: ¥2,000 per person / night",
      pricing_notice_regular: "Regular Rate: ¥7,000 per room / night",
    },
    guest: {
      title: "Guest Information",
      full_name: "Primary Contact Full Name", age: "Age", gender: "Gender",
      gender_opts: ["Female", "Male", "Prefer not to say"],
      phone: "Phone Number", email: "Email Address",
      country: "Country", city: "City", address: "Full Address",
      emergency_name: "Emergency Contact Name (optional)",
      emergency_phone: "Emergency Contact Phone (optional)",
      first_visit: "Is this your first visit to ISKCON Tokyo?",
      initiated: "Are you an initiated devotee?",
      spiritual_name: "Spiritual Name", guru_name: "Guru's Name",
      yes: "Yes", no: "No",
    },
    purpose: {
      title: "Purpose of Visit",
      label: "I am visiting for",
      seva: "Temple Seva", seva_desc: "Volunteer service at the temple (¥2,000 / person / night)",
      darshan: "Pilgrimage / Darshan", darshan_desc: "Visit for blessings and worship (¥7,000 / room / night)",
      retreat: "Spiritual Retreat", retreat_desc: "Long-stay for spiritual practice (¥7,000 / room / night)",
      requested_by: "This stay was requested by",
      self: "Self", organization: "Organization / Temple Authority", other: "Other",
      recommender_name: "Name of Recommending Person / Organization",
      recommender_contact: "Their Contact / Relationship",
      medical: "Medical Conditions (optional, for ashram care)",
      special: "Special Requests or Notes to Admin",
    },
    review: {
      title: "Review & Payment",
      stay_details: "Stay Details", guest_details: "Guest Information",
      purpose_details: "Purpose of Visit", payment_details: "Payment",
      pay_btn: "Pay Deposit via PayPay",
      pay_note: "You will be redirected to PayPay to complete your deposit. The remaining balance is payable on arrival by any method.",
      agree: "I have read and agree to the",
      rules_link: "Ashram Rules & Guidelines",
      submit: "Submit Booking Request",
      pending_note: "Your booking will be reviewed by the ashram coordinator. You will receive a confirmation email once approved.",
    },
    rules: { title: "Ashram Rules & Guidelines", subtitle: "Please read carefully before booking" },
    success: {
      title: "Booking Submitted!",
      subtitle: "Hare Krishna",
      msg: "Your booking request has been received. The ashram coordinator will review it and you will be notified by email once it is approved.",
      ref: "Reference Number",
      deposit_msg: "Your deposit payment of",
      deposit_msg2: "has been recorded.",
      new_booking: "Make Another Booking",
    },
    nav_lang: "日本語",
    next: "Next", back: "Back", required: "This field is required",
    room_note: "Only women / matajis may stay at this ashram.",
  },
  ja: {
    nav: { home: "ホーム", booking: "予約する", rules: "アシュラムのルール", contact: "お問い合わせ" },
    hero: { title: "マタジ・アシュラム", subtitle: "ISKCON 東京", tagline: "献身・奉仕・精神的成長のための聖なる場所" },
    steps: ["滞在の詳細", "ゲスト情報", "訪問の目的", "確認と支払い"],
    stay: {
      title: "滞在日程を選択",
      checkin: "チェックイン日", checkout: "チェックアウト日",
      nights: "泊", nights_plural: "泊",
      available: "空き有り", unavailable: "満室",
      summary: "滞在サマリー",
      total: "合計金額", deposit: "デポジット（今すぐ支払い・50%）", balance: "到着時支払い残額",
      select_room: "割り当てられるお部屋",
      room1: "部屋1 — ヴリンダーヴァン", room2: "部屋2 — マーヤープル",
      max_stay: "最大滞在期間は30日間です",
      guests_count: "宿泊人数 (信者数)",
      rooms_count: "必要な部屋数",
      pricing_notice_seva: "ご奉仕料金: 1名様1泊あたり ¥2,000",
      pricing_notice_regular: "通常料金: 1部屋1泊あたり ¥7,000",
    },
    guest: {
      title: "ゲスト情報",
      full_name: "代表者氏名", age: "年齢", gender: "性別",
      gender_opts: ["女性", "男性", "回答しない"],
      phone: "電話番号", email: "メールアドレス",
      country: "国", city: "市区町村", address: "住所",
      emergency_name: "緊急連絡先氏名（任意）",
      emergency_phone: "緊急連絡先電話番号（任意）",
      first_visit: "ISKCON東京への訪問は初めてですか？",
      initiated: "ディークシャー（入信）を受けた信者ですか？",
      spiritual_name: "精神的な名前", guru_name: "グルのお名前",
      yes: "はい", no: "いいえ",
    },
    purpose: {
      title: "訪問の目的",
      label: "訪問の目的",
      seva: "寺院セーヴァ", seva_desc: "寺院でのボランティア奉仕 (1名様1泊あたり ¥2,000)",
      darshan: "巡礼 / ダルシャン", darshan_desc: "祈りと礼拝のための訪問 (1部屋1泊あたり ¥7,000)",
      retreat: "精神的リトリート", retreat_desc: "精神修行のための長期滞在 (1部屋1泊あたり ¥7,000)",
      requested_by: "この滞在のリクエスト者",
      self: "本人", organization: "団体 / 寺院当局", other: "その他",
      recommender_name: "推薦者または団体名",
      recommender_contact: "連絡先 / 関係",
      medical: "医療上の注意事項（任意）",
      special: "管理者へのメモや特別なご要望",
    },
    review: {
      title: "確認と支払い",
      stay_details: "滞在の詳細", guest_details: "ゲスト情報",
      purpose_details: "訪問の目的", payment_details: "お支払い",
      pay_btn: "PayPayでデポジットを支払う",
      pay_note: "PayPayにリダイレクトされてデポジットをお支払いいただきます。残額は到着時にいずれかの方法でお支払いください。",
      agree: "以下に同意します：",
      rules_link: "アシュラムのルールとガイドライン",
      submit: "予約リクエストを送信",
      pending_note: "予約はアシュラムのコーディネーターが確認します。承認後、メールでご連絡いたします。",
    },
    rules: { title: "アシュラムのルールとガイドライン", subtitle: "予約前に注意してお読みください" },
    success: {
      title: "予約を受け付けました！",
      subtitle: "ハレー・クリシュナ",
      msg: "予約リクエストを受け付けました。アシュラムのコーディネーターが確認後、承認されましたらメールでご連絡いたします。",
      ref: "予約番号",
      deposit_msg: "デポジット",
      deposit_msg2: "のお支払いを確認しました。",
      new_booking: "新しい予約をする",
    },
    nav_lang: "English",
    next: "次へ", back: "戻る", required: "必須項目です",
    room_note: "このアシュラムは女性信者（マタジ）専用です。",
  },
};

function formatDate(d) { if (!d) return ""; return d.toISOString().split("T")[0]; }
function parseDate(s) { if (!s) return null; const [y,m,day] = s.split("-").map(Number); return new Date(y,m-1,day); }
function diffDays(a,b) { if (!a||!b) return 0; return Math.round((b-a)/86400000); }
function genRef() { return "ISK-" + Math.random().toString(36).substring(2,8).toUpperCase(); }

const SAFFRON = "#C4581A";
const GOLD = "#D4A017";
const DEEP = "#1a0a00";

export default function App() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [step, setStep] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(genRef());
  const [errors, setErrors] = useState({});

  const [stay, setStay] = useState({ checkin: "", checkout: "", guestsCount: "1", roomsCount: 1 });
  const [guest, setGuest] = useState({
    full_name: "", age: "", gender: "", phone: "", email: "",
    country: "", city: "", address: "",
    emergency_name: "", emergency_phone: "",
    first_visit: "", initiated: "", spiritual_name: "", guru_name: "",
  });
  const [purpose, setPurpose] = useState({
    type: "seva", // Default set to Seva to activate baseline parameters
    requested_by: "organization", // Automatically default to organization since 'self' is disabled under Seva
    recommender_name: "",
    recommender_contact: "",
    medical: "",
    special: "",
  });
  const [agreed, setAgreed] = useState(false);

  const nights = stay.checkin && stay.checkout ? diffDays(parseDate(stay.checkin), parseDate(stay.checkout)) : 0;
  
  const guestsNum = parseInt(stay.guestsCount, 10) || 1;
  const computedRooms = guestsNum > 2 ? 2 : 1;
  
  // Dynamic pricing formulation logic block
  const total = purpose.type === "seva" 
    ? (nights * 2000 * guestsNum)        
    : (nights * 7000 * computedRooms);   
    
  const deposit = Math.round(total * 0.5);
  const balance = total - deposit;

  function handleGuestChange(count) {
    const num = parseInt(count, 10) || 1;
    setStay(p => ({
      ...p,
      guestsCount: count,
      roomsCount: num > 2 ? 2 : 1
    }));
  }

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!stay.checkin) e.checkin = true;
      if (!stay.checkout) e.checkout = true;
      if (nights <= 0 && stay.checkin && stay.checkout) e.dates = true;
      if (nights > 30) e.max = true;
    }
    if (s === 1) {
      ["full_name","age","gender","phone","email","country","city","address","first_visit","initiated"]
        .forEach(k => { if (!guest[k]) e[k] = true; });
      if (guest.initiated === "yes" && !guest.spiritual_name) e.spiritual_name = true;
    }
    if (s === 2) { 
      if (!purpose.type) e.type = true; 
      
      // Forces audit checks if Seva discount is requested
      if (purpose.type === "seva") {
        if (!purpose.recommender_name) e.recommender_name = true;
        if (!purpose.recommender_contact) e.recommender_contact = true;
      }
    }
    if (s === 3) { if (!agreed) e.agreed = true; }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() { if (validateStep(step)) setStep(s => Math.min(s+1,3)); }
  function prevStep() { setStep(s => Math.max(s-1,0)); }
  function handleSubmit() { if (validateStep(3)) setSubmitted(true); }

  const today = formatDate(new Date());
  const maxDate = (() => { const d = new Date(); d.setDate(d.getDate()+180); return formatDate(d); })();

  if (submitted) return (
    <SuccessPage t={t} bookingRef={bookingRef} deposit={deposit} lang={lang}
      onNew={() => { setSubmitted(false); setStep(0);
        setStay({checkin:"",checkout:"",guestsCount:"1",roomsCount:1});
        setGuest({full_name:"",age:"",gender:"",phone:"",email:"",country:"",city:"",address:"",emergency_name:"",emergency_phone:"",first_visit:"",initiated:"",spiritual_name:"",guru_name:""});
        setPurpose({type:"seva",requested_by:"organization",recommender_name:"",recommender_contact:"",medical:"",special:""});
        setAgreed(false); }} />
  );

  return (
    <div style={{fontFamily:"'Cormorant Garamond', Georgia, serif", minHeight:"100vh", background:"#fdf8f2", color:DEEP}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input,select,textarea { font-family:'Crimson Pro',Georgia,serif; font-size:15px; background:#fff; border:1px solid #e0d4c0; border-radius:6px; padding:9px 12px; width:100%; color:${DEEP}; outline:none; transition:border 0.2s; }
        input:focus,select:focus,textarea:focus { border-color:${SAFFRON}; }
        input.err,select.err,textarea.err { border-color:#c0392b; }
        label { font-family:'Crimson Pro',serif; font-size:13px; letter-spacing:0.05em; color:#7a5c3a; text-transform:uppercase; display:block; margin-bottom:4px; }
        .field { margin-bottom:14px; }
        .err-msg { font-size:12px; color:#c0392b; margin-top:3px; }
        .radio-opt { display:flex; align-items:center; gap:6px; cursor:pointer; font-family:'Crimson Pro',serif; font-size:15px; padding:8px 14px; border:1px solid #e0d4c0; border-radius:8px; transition:all 0.18s; background:#fff; }
        .radio-opt:hover { border-color:${SAFFRON}; }
        .radio-opt.selected { border-color:${SAFFRON}; background:#fdf0e4; color:${SAFFRON}; font-weight:500; }
        .radio-opt input { display:none; }
        .purpose-card { border:1.5px solid #e0d4c0; border-radius:12px; padding:16px 20px; cursor:pointer; transition:all 0.2s; background:#fff; display:flex; align-items:flex-start; gap:14px; margin-bottom:10px; }
        .purpose-card:hover { border-color:${SAFFRON}; }
        .purpose-card.selected { border-color:${SAFFRON}; background:#fdf0e4; }
        .btn-primary { background:${SAFFRON}; color:#fff; border:none; border-radius:8px; padding:12px 28px; font-family:'Crimson Pro',serif; font-size:16px; cursor:pointer; letter-spacing:0.04em; transition:background 0.2s; }
        .btn-primary:hover { background:#a8450e; }
        .btn-secondary { background:transparent; color:${SAFFRON}; border:1.5px solid ${SAFFRON}; border-radius:8px; padding:11px 24px; font-family:'Crimson Pro',serif; font-size:16px; cursor:pointer; letter-spacing:0.04em; transition:all 0.2s; }
        .btn-secondary:hover { background:#fdf0e4; }
        .btn-paypay { background:#e60012; color:#fff; border:none; border-radius:8px; padding:14px 28px; font-family:'Crimson Pro',serif; font-size:16px; cursor:pointer; display:flex; align-items:center; gap:10px; transition:background 0.2s; }
        .btn-paypay:hover { background:#b5000e; }
        .review-section { background:#fff; border:1px solid #e0d4c0; border-radius:12px; padding:18px 20px; margin-bottom:14px; }
        .review-row { display:flex; justify-content:space-between; padding:5px 0; font-family:'Crimson Pro',serif; font-size:15px; border-bottom:0.5px solid #f0e8d8; }
        .review-row:last-child { border-bottom:none; }
        .review-label { color:#7a5c3a; }
        .review-value { font-weight:500; text-align:right; max-width:60%; }
        @media(max-width:640px){
          .grid-2{grid-template-columns:1fr !important;}
          .hero-title{font-size:2.2rem !important;}
          .step-label{display:none;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{background:"#1a0a00", borderBottom:`3px solid ${GOLD}`, padding:"0 24px", display:"flex", justifyContent:"space-between", alignItems:"center", height:64}}>
        <div style={{display:"flex", alignItems:"center", gap:14}}>
        <img src={LOGO_WHITE} alt="ISKCON Tokyo" style={{height: 44, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)"}} /> 
          <div style={{borderLeft:"1px solid #5a3a10", paddingLeft:14}}>
            <div style={{color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, letterSpacing:"0.08em"}}>ISKCON TOKYO</div>
            <div style={{color:"#c4a56a", fontSize:11, letterSpacing:"0.14em", fontFamily:"'Crimson Pro',serif"}}>MATAJI ASHRAM</div>
          </div>
        </div>
        <div style={{display:"flex", gap:20, alignItems:"center"}}>
          {["home","rules","contact"].map(k => (
            <button key={k} onClick={() => k==="rules" && setShowRules(true)}
              style={{background:"none", border:"none", color:"#c4a56a", fontFamily:"'Crimson Pro',serif", fontSize:14, cursor:"pointer", letterSpacing:"0.06em"}}>
              {t.nav[k]}
            </button>
          ))}
          <button onClick={() => setLang(lang==="en"?"ja":"en")}
            style={{background:"none", border:`1px solid ${GOLD}`, color:GOLD, fontFamily:"'Crimson Pro',serif", fontSize:13, cursor:"pointer", padding:"4px 12px", borderRadius:6}}>
            {t.nav_lang}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,#1a0a00 0%,#3d1a00 50%,#1a0a00 100%)`, padding:"52px 24px 44px", textAlign:"center", borderBottom:`2px solid ${GOLD}`, position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(212,160,23,0.08) 0%,transparent 60%),radial-gradient(circle at 80% 50%,rgba(196,88,26,0.08) 0%,transparent 60%)"}} />
        <div style={{position:"relative"}}>
          <div style={{color:GOLD, fontSize:13, letterSpacing:"0.2em", fontFamily:"'Crimson Pro',serif", marginBottom:10}}>✦ HARE KRISHNA ✦</div>
          <h1 className="hero-title" style={{color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontSize:"3.2rem", fontWeight:600, lineHeight:1.1, marginBottom:6}}>{t.hero.title}</h1>
          <div style={{color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontStyle:"italic", marginBottom:14}}>{t.hero.subtitle}</div>
          <p style={{color:"#c4a56a", fontFamily:"'Crimson Pro',serif", fontSize:16, maxWidth:500, margin:"0 auto 22px"}}>{t.hero.tagline}</p>
          <div style={{color:"#9a7a4a", fontFamily:"'Crimson Pro',serif", fontSize:13, letterSpacing:"0.1em"}}>{t.room_note}</div>
        </div>
      </div>

      {/* STEPPER */}
      <div style={{background:"#fff", borderBottom:"1px solid #e0d4c0", padding:"16px 24px"}}>
        <div style={{maxWidth:680, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative"}}>
          <div style={{position:"absolute", top:14, left:"10%", right:"10%", height:1, background:"#e0d4c0", zIndex:0}} />
          {t.steps.map((s,i) => (
            <div key={i} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6, zIndex:1, cursor:i<step?"pointer":"default"}} onClick={() => i<step && setStep(i)}>
              <div style={{width:28, height:28, borderRadius:"50%", background:i<=step?SAFFRON:"#e0d4c0", color:i<=step?"#fff":"#999", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontFamily:"'Crimson Pro',serif", fontWeight:500, transition:"all 0.3s"}}>{i<step?"✓":i+1}</div>
              <span className="step-label" style={{fontSize:11, color:i===step?SAFFRON:"#9a7a4a", fontFamily:"'Crimson Pro',serif", letterSpacing:"0.06em", whiteSpace:"nowrap"}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM WINDOW */}
      <div style={{maxWidth:720, margin:"0 auto", padding:"32px 20px 60px"}}>

        {/* STEP 0: HOUSING SPECIFICATION CONFIGURATION */}
        {step===0 && (
          <div>
            <SectionTitle icon="🗓️" title={t.stay.title} />
            
            <div style={{background:"#fff8f0", border:`1px solid ${GOLD}30`, borderRadius:10, padding:"12px 16px", marginBottom:20, fontFamily:"'Crimson Pro',serif", fontSize:14, color:"#4a3020", lineHeight:"1.5"}}>
              <div style={{fontWeight:600, color:SAFFRON, marginBottom:4}}>✦ {t.stay.summary}:</div>
              • {t.stay.pricing_notice_seva}<br />
              • {t.stay.pricing_notice_regular}
            </div>

            <div className="grid-2" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:14}}>
              <div className="field">
                <label>{t.stay.checkin}</label>
                <input type="date" className={errors.checkin?"err":""} min={today} max={maxDate} value={stay.checkin}
                  onChange={e => setStay(p => ({...p, checkin:e.target.value, checkout:p.checkout&&p.checkout<=e.target.value?"":p.checkout}))} />
                {errors.checkin && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.stay.checkout}</label>
                <input type="date" className={errors.checkout?"err":""} min={stay.checkin||today} max={maxDate} value={stay.checkout}
                  onChange={e => setStay(p => ({...p, checkout:e.target.value}))} />
                {errors.checkout && <div className="err-msg">{t.required}</div>}
              </div>
            </div>
            {errors.dates && <div className="err-msg" style={{marginBottom:12}}>Check-out must be after check-in.</div>}
            {errors.max && <div className="err-msg" style={{marginBottom:12}}>{t.stay.max_stay}</div>}

            <div className="grid-2" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20}}>
              <div className="field">
                <label>{t.stay.guests_count} *</label>
                <select value={stay.guestsCount} onChange={e => handleGuestChange(e.target.value)}>
                  <option value="1">1 Devotee</option>
                  <option value="2">2 Devotees (1 Room)</option>
                  <option value="3">3 Devotees (2 Rooms Required)</option>
                  <option value="4">4 Devotees (2 Rooms Required)</option>
                </select>
              </div>

              <div className="field">
                <label>{t.stay.rooms_count}</label>
                <input type="text" value={`${computedRooms} Room(s)`} disabled style={{background:"#f5edd650", color:"#7a5c3a", fontWeight:500}} />
              </div>
            </div>

            <div className="field">
              <label>{t.stay.select_room}</label>
              <div style={{display:"grid", gridTemplateColumns:computedRooms === 1 ? "1fr 1fr" : "1fr", gap:12}}>
                {computedRooms === 1 ? (
                  <>
                    <div style={{border:`2px solid ${SAFFRON}`, borderRadius:10, padding:"14px 16px", background:"#fdf0e4"}}>
                      <div style={{fontSize:24, marginBottom:6}}>🛏️</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, color:SAFFRON}}>{t.stay.room1}</div>
                      <div style={{fontSize:12, color:"#7a5c3a", fontFamily:"'Crimson Pro',serif", marginTop:2}}>Max 2 Persons</div>
                    </div>
                    <div style={{border:`1px solid #e0d4c0`, borderRadius:10, padding:"14px 16px", opacity:0.6, background:"#fff"}}>
                      <div style={{fontSize:24, marginBottom:6}}>🛏️</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, color:DEEP}}>{t.stay.room2}</div>
                      <div style={{fontSize:12, color:"#7a5c3a", fontFamily:"'Crimson Pro',serif", marginTop:2}}>Backup Room Allocated Next</div>
                    </div>
                  </>
                ) : (
                  <div style={{border:`2px solid ${SAFFRON}`, borderRadius:10, padding:"14px 16px", background:"#fdf0e4", display:"flex", gap:20, alignItems:"center"}}>
                    <div style={{fontSize:32}}>🛏️ 🛏️</div>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:16, color:SAFFRON}}>{t.stay.room1} & {t.stay.room2}</div>
                      <div style={{fontSize:13, color:"#7a5c3a", fontFamily:"'Crimson Pro',serif", marginTop:2}}>Both rooms booked simultaneously to accommodate {guestsNum} devotees.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {nights>0 && (
              <div style={{background:"#fff", border:`1.5px solid ${GOLD}60`, borderRadius:12, padding:"18px 20px", marginTop:8}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, marginBottom:12, color:"#7a5c3a", letterSpacing:"0.06em"}}>{t.stay.summary} ({purpose.type === "seva" ? "Seva Rate" : "Regular Rate"})</div>
                {[
                  [lang==="en" ? `Duration` : `滞在期間`, `${nights} ${t.stay.nights}`],
                  [lang==="en" ? `Calculation parameters` : `内訳算出`, purpose.type === "seva" ? `¥2,000 × ${guestsNum} Persons` : `¥7,000 × ${computedRooms} Rooms`],
                  [t.stay.total, `¥${total.toLocaleString()}`],
                  [t.stay.deposit, `¥${deposit.toLocaleString()}`],
                  [t.stay.balance, `¥${balance.toLocaleString()}`],
                ].map(([k,v],i) => (
                  <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i===1||i===3?"0.5px solid #f0e8d8":"none", fontFamily:"'Crimson Pro',serif", fontSize:15}}>
                    <span style={{color:"#7a5c3a"}}>{k}</span>
                    <span style={{fontWeight:i<2?400:600, color:i===2?SAFFRON:DEEP}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 1: DEVOTEE CONTACT AND SPECS PROFILE */}
        {step===1 && (
          <div>
            <SectionTitle icon="🙏" title={t.guest.title} />
            <div className="grid-2" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
              <div className="field" style={{gridColumn:"1 / -1"}}>
                <label>{t.guest.full_name} *</label>
                <input className={errors.full_name?"err":""} value={guest.full_name}
                  onChange={e => setGuest(p => ({...p,full_name:e.target.value}))}
                  placeholder={lang==="en"?"As per passport / ID":"パスポート・IDの通り"} />
                {errors.full_name && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.age} *</label>
                <input type="number" min="5" max="100" className={errors.age?"err":""}
                  value={guest.age} onChange={e => setGuest(p => ({...p,age:e.target.value}))} />
                {errors.age && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.gender} *</label>
                <select className={errors.gender?"err":""} value={guest.gender}
                  onChange={e => setGuest(p => ({...p,gender:e.target.value}))}>
                  <option value="">—</option>
                  {t.guest.gender_opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.gender && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.phone} *</label>
                <input type="tel" className={errors.phone?"err":""} value={guest.phone}
                  onChange={e => setGuest(p => ({...p,phone:e.target.value}))} placeholder="+81 90-0000-0000" />
                {errors.phone && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.email} *</label>
                <input type="email" className={errors.email?"err":""} value={guest.email}
                  onChange={e => setGuest(p => ({...p,email:e.target.value}))} placeholder="email@example.com" />
                {errors.email && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.country} *</label>
                <input className={errors.country?"err":""} value={guest.country}
                  onChange={e => setGuest(p => ({...p,country:e.target.value}))} />
                {errors.country && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.city} *</label>
                <input className={errors.city?"err":""} value={guest.city}
                  onChange={e => setGuest(p => ({...p,city:e.target.value}))} />
                {errors.city && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field" style={{gridColumn:"1 / -1"}}>
                <label>{t.guest.address} *</label>
                <textarea rows={2} className={errors.address?"err":""} value={guest.address}
                  onChange={e => setGuest(p => ({...p,address:e.target.value}))} />
                {errors.address && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.guest.emergency_name}</label>
                <input value={guest.emergency_name}
                  onChange={e => setGuest(p => ({...p,emergency_name:e.target.value}))} />
              </div>
              <div className="field">
                <label>{t.guest.emergency_phone}</label>
                <input type="tel" value={guest.emergency_phone}
                  onChange={e => setGuest(p => ({...p,emergency_phone:e.target.value}))} />
              </div>
            </div>

            {[{key:"first_visit",label:t.guest.first_visit},{key:"initiated",label:t.guest.initiated}].map(({key,label}) => (
              <div key={key} className="field" style={{marginTop:10}}>
                <label>{label} *</label>
                <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                  {["yes","no"].map(v => (
                    <label key={v} className={`radio-opt${guest[key]===v?" selected":""}`}
                      onClick={() => setGuest(p => ({...p,[key]:v}))}>
                      <input type="radio" name={key} value={v} checked={guest[key]===v} onChange={() => {}} />
                      {v==="yes"?t.guest.yes:t.guest.no}
                    </label>
                  ))}
                </div>
                {errors[key] && <div className="err-msg">{t.required}</div>}
              </div>
            ))}

            {guest.initiated==="yes" && (
              <div className="grid-2" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:10}}>
                <div className="field">
                  <label>{t.guest.spiritual_name} *</label>
                  <input className={errors.spiritual_name?"err":""} value={guest.spiritual_name}
                    onChange={e => setGuest(p => ({...p,spiritual_name:e.target.value}))} />
                  {errors.spiritual_name && <div className="err-msg">{t.required}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.guru_name}</label>
                  <input value={guest.guru_name}
                    onChange={e => setGuest(p => ({...p,guru_name:e.target.value}))} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PURPOSE CLASSIFICATION & MANDATORY REFERRALS */}
        {step===2 && (
          <div>
            <SectionTitle icon="🪷" title={t.purpose.title} />
            <div className="field">
              <label>{t.purpose.label} *</label>
              <div style={{marginTop:6}}>
                {[
                  {id:"seva", icon:"🙏", title:t.purpose.seva, desc:t.purpose.seva_desc},
                  {id:"darshan", icon:"🪷", title:t.purpose.darshan, desc:t.purpose.darshan_desc},
                  {id:"retreat", icon:"🌿", title:t.purpose.retreat, desc:t.purpose.retreat_desc},
                ].map(p => (
                  <div key={p.id} className={`purpose-card${purpose.type===p.id?" selected":""}`}
                    onClick={() => setPurpose(prev => ({
                      ...prev,
                      type: p.id,
                      // Automatically transitions requested_by away from 'self' if Seva profile is toggled
                      requested_by: p.id === "seva" && prev.requested_by === "self" ? "organization" : prev.requested_by
                    }))}>
                    <div style={{width:42, height:42, borderRadius:"50%", background:purpose.type===p.id?"#fdf0e4":"#f9f3eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0}}>{p.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:16, color:purpose.type===p.id?SAFFRON:DEEP}}>{p.title}</div>
                      <div style={{fontFamily:"'Crimson Pro',serif", fontSize:14, color:"#7a5c3a", marginTop:2}}>{p.desc}</div>
                    </div>
                    {purpose.type===p.id && <div style={{color:SAFFRON, fontSize:20}}>✓</div>}
                  </div>
                ))}
              </div>
              {errors.type && <div className="err-msg">{t.required}</div>}
            </div>

            <div style={{background:"#f4ecd8", borderLeft:`4px solid ${GOLD}`, padding:"12px", borderRadius:"0 8px 8px 0", fontFamily:"'Crimson Pro',serif", fontSize:14, color:DEEP, marginBottom:20}}>
              💡 <strong>Live Pricing Sync:</strong> Based on selection, the total billing amount is automatically recalculated to 
              <strong> {purpose.type === "seva" ? "¥2,000 per person/night" : "¥7,000 per room/night"}</strong>.
            </div>

            <div className="field">
              <label>{t.purpose.requested_by}</label>
              <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                {[
                  // Dynamically strip and remove 'self' option block if Seva criteria matches
                  ...(purpose.type !== "seva" ? [["self", t.purpose.self]] : []),
                  ["organization", t.purpose.organization],
                  ["other", t.purpose.other]
                ].map(([v, label]) => (
                  <label key={v} className={`radio-opt${purpose.requested_by === v ? " selected" : ""}`}
                    onClick={() => setPurpose(p => ({...p, requested_by: v}))}>
                    <input type="radio" name="rby" value={v} checked={purpose.requested_by === v} onChange={() => {}} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Referral Audit Block: Explicitly forced with red asterisks for Seva, optional for others */}
            <div className="grid-2" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
              <div className="field">
                <label>
                  {t.purpose.recommender_name}{" "}
                  {purpose.type === "seva" ? (
                    <span style={{ color: "#c0392b", fontWeight: "bold" }}>*</span>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#9a7a4a", textTransform: "none" }}>(Optional)</span>
                  )}
                </label>
                <input 
                  className={errors.recommender_name ? "err" : ""} 
                  value={purpose.recommender_name}
                  onChange={e => setPurpose(p => ({...p, recommender_name: e.target.value}))} 
                  placeholder="e.g., Temple President / Devotee Name"
                />
                {errors.recommender_name && <div className="err-msg">{t.required}</div>}
              </div>
              
              <div className="field">
                <label>
                  {t.purpose.recommender_contact}{" "}
                  {purpose.type === "seva" ? (
                    <span style={{ color: "#c0392b", fontWeight: "bold" }}>*</span>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#9a7a4a", textTransform: "none" }}>(Optional)</span>
                  )}
                </label>
                <input 
                  className={errors.recommender_contact ? "err" : ""} 
                  value={purpose.recommender_contact}
                  onChange={e => setPurpose(p => ({...p, recommender_contact: e.target.value}))} 
                  placeholder="Phone number or spiritual relationship"
                />
                {errors.recommender_contact && <div className="err-msg">{t.required}</div>}
              </div>
            </div>

            <div className="field" style={{marginTop:10}}>
              <label>{t.purpose.medical}</label>
              <textarea rows={2} value={purpose.medical}
                onChange={e => setPurpose(p => ({...p,medical:e.target.value}))} />
            </div>
            <div className="field">
              <label>{t.purpose.special}</label>
              <textarea rows={3} value={purpose.special}
                onChange={e => setPurpose(p => ({...p,special:e.target.value}))}
                placeholder={lang==="en"?"Any message to the ashram coordinator...":"アシュラムのコーディネーターへのメッセージ..."} />
            </div>
          </div>
        )}

        {/* STEP 3: CONSOLIDATED VERIFICATION AUDIT SCREEN */}
        {step===3 && (
          <div>
            <SectionTitle icon="📋" title={t.review.title} />

            <div className="review-section">
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, marginBottom:10, color:"#7a5c3a"}}>{t.review.stay_details}</div>
              {[
                [lang==="en"?"Check-in":"チェックイン", stay.checkin],
                [lang==="en"?"Check-out":"チェックアウト", stay.checkout],
                [lang==="en"?"Total Guests Allocated":"合計宿泊人数", `${guestsNum} Devotee(s)`],
                [lang==="en"?"Rooms Reserved Simultaneously":"確保された総部屋数", `${computedRooms} Room(s)`],
                [lang==="en"?"Applied Rate Model Profile":"適用レート型", purpose.type==="seva"?"Seva Per-Head Rate (¥2,000)":"Regular Per-Room Rate (¥7,000)"],
                [t.stay.total, `¥${total.toLocaleString()}`],
                [t.stay.deposit, `¥${deposit.toLocaleString()}`],
                [t.stay.balance, `¥${balance.toLocaleString()}`],
              ].map(([k,v]) => (
                <div key={k} className="review-row">
                  <span className="review-label">{k}</span>
                  <span className="review-value">{v}</span>
                </div>
              ))}
            </div>

            <div className="review-section">
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, marginBottom:10, color:"#7a5c3a"}}>{t.review.guest_details}</div>
              {[
                [t.guest.full_name, guest.full_name],
                [t.guest.email, guest.email],
                [t.guest.phone, guest.phone],
                [lang==="en"?"Country / City":"国 / 市区町村", `${guest.country} / ${guest.city}`],
                [t.guest.first_visit, guest.first_visit==="yes"?t.guest.yes:t.guest.no],
                [t.guest.initiated, guest.initiated==="yes"?t.guest.yes:t.guest.no],
                ...(guest.initiated==="yes"?[[t.guest.spiritual_name, guest.spiritual_name]]:[]),
              ].map(([k,v]) => (
                <div key={k} className="review-row">
                  <span className="review-label">{k}</span>
                  <span className="review-value">{v}</span>
                </div>
              ))}
            </div>

            <div className="review-section">
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, marginBottom:10, color:"#7a5c3a"}}>{t.review.purpose_details}</div>
              {[
                [t.purpose.label, purpose.type==="seva"?t.purpose.seva:purpose.type==="darshan"?t.purpose.darshan:t.purpose.retreat],
                [t.purpose.recommender_name, purpose.recommender_name || "N/A"],
                [t.purpose.recommender_contact, purpose.recommender_contact || "N/A"],
                ...(purpose.special?[[lang==="en"?"Notes":"メモ", purpose.special]]:[]),
              ].map(([k,v]) => (
                <div key={k} className="review-row">
                  <span className="review-label">{k}</span>
                  <span className="review-value">{v}</span>
                </div>
              ))}
            </div>

            <div style={{background:"#fff5f5", border:"1px solid #e0c0c0", borderRadius:12, padding:"18px 20px", marginBottom:18}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:15, marginBottom:6, color:"#7a5c3a"}}>{t.review.payment_details}</div>
              <div style={{fontFamily:"'Crimson Pro',serif", fontSize:14, color:"#7a5c3a", marginBottom:14}}>{t.review.pay_note}</div>
              <button className="btn-paypay"
                onClick={() => alert("PayPay payment gateway redirect initialized.\n\nTransaction Fee: ¥" + deposit.toLocaleString())}>
                <span style={{fontSize:20}}>💳</span>
                {t.review.pay_btn} — ¥{deposit.toLocaleString()}
              </button>
            </div>

            <div style={{display:"flex", alignItems:"flex-start", gap:10, marginBottom:18, fontFamily:"'Crimson Pro',serif", fontSize:15}}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{width:18, height:18, marginTop:2, flexShrink:0, cursor:"pointer"}} />
              <label htmlFor="agree" style={{textTransform:"none", color:DEEP, cursor:"pointer", fontSize:15}}>
                {t.review.agree}{" "}
                <button onClick={() => setShowRules(true)}
                  style={{background:"none", border:"none", color:SAFFRON, cursor:"pointer", fontFamily:"'Crimson Pro',serif", fontSize:15, textDecoration:"underline"}}>
                  {t.review.rules_link}
                </button>
              </label>
            </div>
            {errors.agreed && <div className="err-msg" style={{marginBottom:10}}>{lang==="en"?"Please agree to the ashram rules to continue.":"アシュラムのルールに同意してください。"}</div>}

            <div style={{background:"#f9f3eb", borderRadius:8, padding:"10px 14px", fontFamily:"'Crimson Pro',serif", fontSize:13, color:"#7a5c3a", marginBottom:20}}>
              ℹ️ {t.review.pending_note}
            </div>
          </div>
        )}

        {/* STEPPER STEPPING ACTION REGISTRATION ACTIONS */}
        <div style={{display:"flex", justifyContent:"space-between", marginTop:28, gap:12}}>
          {step>0 ? <button className="btn-secondary" onClick={prevStep}>{t.back}</button> : <div />}
          {step<3
            ? <button className="btn-primary" onClick={nextStep}>{t.next} →</button>
            : <button className="btn-primary" onClick={handleSubmit} style={{background:"#4a7c4e"}}>{t.review.submit} ✓</button>
          }
        </div>
      </div>

      {/* ASHRAM PORTAL RULES RULES DIALOG POPOVER */}
      {showRules && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
          <div style={{background:"#fff", borderRadius:14, maxWidth:680, width:"100%", maxHeight:"85vh", overflow:"auto"}}>
            <div style={{background:DEEP, padding:"18px 24px", borderRadius:"14px 14px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={{color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600}}>{t.rules.title}</div>
                <div style={{color:"#c4a56a", fontFamily:"'Crimson Pro',serif", fontSize:13, marginTop:2}}>{t.rules.subtitle}</div>
              </div>
              <button onClick={() => setShowRules(false)} style={{background:"none", border:"none", color:"#c4a56a", cursor:"pointer", fontSize:22}}>✕</button>
            </div>
            <div style={{padding:24}}>
              <div style={{background:"#f9f3eb", border:"1px dashed #e0d4c0", borderRadius:10, padding:"20px", textAlign:"center", color:"#7a5c3a", fontFamily:"'Crimson Pro',serif", marginBottom:20}}>
                <div style={{fontSize:40, marginBottom:10}}>📄</div>
                <div style={{fontSize:16, fontWeight:500, marginBottom:6}}>ashram-rules.pdf</div>
                <div style={{fontSize:13, color:"#9a7a4a"}}>The original ashram guidelines will reference your local PDF file.</div>
              </div>
              {[
                ["Maximum Capacity","Strictly limited to 2 devotees per room context."],
                ["Wake-up Arati","4:30 AM — Mangala Arati attendance encouraged."],
                ["Dress Code","Modest traditional or clean attire at all times."],
                ["Silence Hours","10:00 PM – 4:30 AM daily."],
              ].map(([k,v]) => (
                <div key={k} style={{display:"flex", gap:12, padding:"10px 0", borderBottom:"0.5px solid #f0e8d8", fontFamily:"'Crimson Pro',serif"}}>
                  <div style={{minWidth:140, color:SAFFRON, fontWeight:500, fontSize:14}}>{k}</div>
                  <div style={{color:"#4a3020", fontSize:14}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{background:DEEP, borderTop:`2px solid ${GOLD}`, padding:"24px", textAlign:"center"}}>
        <div style={{color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontSize:14, letterSpacing:"0.12em", marginBottom:6}}>HARE KRISHNA HARE KRISHNA · KRISHNA KRISHNA HARE HARE</div>
        <div style={{color:"#7a5c3a", fontFamily:"'Crimson Pro',serif", fontSize:12}}>ISKCON Tokyo Mataji Ashram · © {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

function SectionTitle({icon,title}) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:22, paddingBottom:12, borderBottom:"1.5px solid #f0e8d8"}}>
      <span style={{fontSize:22}}>{icon}</span>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:DEEP}}>{title}</h2>
    </div>
  );
}

function SuccessPage({t,bookingRef,deposit,lang,onNew}) {
  return (
    <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif", minHeight:"100vh", background:"#fdf8f2", display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
      <div style={{maxWidth:500, width:"100%", textAlign:"center"}}>
        <div style={{fontSize: 48, marginBottom: 14}}>🛕</div>
        <div style={{color:"#7a5c3a", fontFamily:"'Crimson Pro',serif", letterSpacing:"0.15em", fontSize:13, marginBottom:8}}>✦ {t.success.subtitle} ✦</div>
        <h1 style={{fontSize:"2.2rem", fontWeight:600, color:DEEP, marginBottom:16}}>{t.success.title}</h1>
        <p style={{fontFamily:"'Crimson Pro',serif", fontSize:16, color:"#4a3020", lineHeight:1.7, marginBottom:24}}>{t.success.msg}</p>
        <div style={{background:"#fff", border:`1.5px solid ${GOLD}60`, borderRadius:12, padding:"20px 24px", marginBottom:24}}>
          <div style={{fontFamily:"'Crimson Pro',serif", fontSize:13, color:"#7a5c3a", letterSpacing:"0.08em", marginBottom:4}}>{t.success.ref}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:SAFFRON, letterSpacing:"0.1em"}}>{bookingRef}</div>
          <div style={{fontFamily:"'Crimson Pro',serif", fontSize:14, color:"#7a5c3a", marginTop:10}}>
            {t.success.deposit_msg} <strong>¥{deposit.toLocaleString()}</strong> {t.success.deposit_msg2}
          </div>
        </div>
        <button onClick={onNew} style={{background:SAFFRON, color:"#fff", border:"none", borderRadius:8, padding:"12px 28px", fontFamily:"'Crimson Pro',serif", fontSize:16, cursor:"pointer", letterSpacing:"0.04em"}}>
          {t.success.new_booking}
        </button>
      </div>
    </div>
  );
}