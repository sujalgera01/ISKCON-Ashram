// src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { submitBooking } from "../firebase/submitBooking";
import { getAllBookings, cancelBookingPublic } from "../firebase/bookingService";
import { getBlockedDates } from "../firebase/availabilityService";
import { sendPendingEmail } from "../firebase/emailService";
import ContactPage from "../components/ContactPage";

const SAFFRON = "#C4581A";
const GOLD = "#D4A017";
const DEEP = "#1a0a00";

// Sanitization & Validation Helper Functions
function sanitizeName(val) {
  return val.replace(/[^a-zA-Z\s\-']/g, "");
}

function sanitizePhone(val) {
  return val.replace(/\D/g, "").slice(0, 10);
}

function sanitizeEmail(val) {
  return val.replace(/\s+/g, "").toLowerCase();
}

function sanitizeIdNumber(val) {
  return val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function sanitizeAge(val) {
  return val.replace(/\D/g, "").slice(0, 2);
}

const translations = {
  en: {
    nav: { home: "Home", booking: "Book a Stay", rules: "Ashram Rules", contact: "Contact", cancel: "Cancel Booking" },
    hero: { 
      title: "Atithi Seva Niwas", 
      subtitle: "ISKCON Tokyo", 
      tagline: "A sacred space for devotion, service & spiritual growth" 
    },
    steps: ["Stay Details", "Guest Info", "Purpose of Visit", "Review & Confirm"],
    stay: {
      title: "Select Your Stay",
      checkin: "Check-in Date", checkout: "Check-out Date",
      checkin_time: "Est. Check-in Time", checkout_time: "Est. Check-out Time",
      nights: "night", nights_plural: "nights",
      summary: "Stay Summary", total: "Total Amount (Pay on Arrival)",
      select_room: "Assigned Accommodations",
      room_capacity_notice: "⚠️ Note: Each room accommodates a maximum of 2 adults. Review live room availability below.",
      pricing_notice_seva: "Seva Rate: ¥2,000 per person / night",
      pricing_notice_regular: "Regular Rate: ¥7,000 per room / night",
      guests_count: "Number of Guests (Devotees)",
    },
    guest: {
      title: "Guest Information", extra_title: "Additional Guest Details",
      full_name: "Primary Contact Full Name", age: "Age", gender: "Gender",
      gender_opts: ["Female", "Male", "Prefer not to say"], phone: "Phone Number (10 Digits)", email: "Email Address",
      country: "Country", city: "City", address: "Full Address", id_proof: "Passport / ID Document Number",
      id_file_label: "Upload Photo of Passport / ID Card",
      first_visit: "Is this your first visit to ISKCON Tokyo?", initiated: "Are you an initiated devotee?",
      spiritual_name: "Spiritual Name", guru_name: "Guru's Name", yes: "Yes", no: "No",
    },
    purpose: {
      title: "Purpose of Visit & Meals", label: "I am visiting for",
      seva: "Temple Seva", seva_desc: "Volunteer service at the temple (¥2,000 / person / night)",
      darshan: "Pilgrimage / Darshan", darshan_desc: "Visit for blessings and worship (¥7,000 / room / night)",
      retreat: "Spiritual Retreat", retreat_desc: "Long-stay for spiritual practice (¥7,000 / room / night)",
      prasadam_label: "Will all guests accept daily temple Prasadam (meals)?",
      prasadam_desc: "Served at strict temple schedules. Pure vegetarian sanctified food.",
      requested_by: "This stay was requested by", self: "Self", organization: "Organization / Temple Authority", other: "Other",
      recommender_name: "Name of Recommending Person / Organization", recommender_contact: "Their Contact / Relationship",
      medical: "Medical Conditions (optional, for ashram care)", special: "Special Requests or Notes to Admin",
    },
    review: {
      title: "Review & Confirm Booking", stay_details: "Stay Details", guest_details: "Guest Information",
      purpose_details: "Purpose of Visit", payment_details: "Cash Payment on Arrival Terms",
      submit: "Confirm Booking Request",
      pay_note: "No online payment required. The entire balance is payable by cash on arrival at the ashram office.",
      disclaimer: "I explicitly verify and declare that all uploaded profile items, text entries, and passport/ID documents are accurate, valid, and legitimate.",
      agree: "I have read and agree to the", rules_link: "Ashram Rules & Guidelines",
    },
    success: {
      title: "Request Submitted!", subtitle: "Hare Krishna",
      msg: "Your stay request is processing. It will be evaluated on a first-come, first-served basis.",
      ref: "Reference Number", total_msg: "Total due on arrival:", new_booking: "Make Another Booking",
    },
    nav_lang: "English", next: "Next", back: "Back", required: "This field is required", 
    room_note: "Matajis share rooms with Matajis only, and Prabhujis share rooms with Prabhujis only.",
  },
  ja: {
    nav: { home: "ホーム", booking: "予約する", rules: "アシュラムのルール", contact: "お問い合わせ", cancel: "予約キャンセル" },
    hero: { 
      title: "アティティ・セーヴァ・ニワス", 
      subtitle: "ISKCON 東京", 
      tagline: "献身・奉仕・精神的成長のための聖なる場所" 
    },
    steps: ["滞在の詳細", "ゲスト情報", "訪問の目的", "確認と確定"],
    stay: {
      title: "滞在日程を選択", checkin: "チェックイン日", checkout: "チェックアウト日",
      checkin_time: "チェックイン予定時刻", checkout_time: "チェックアウト予定時刻",
      nights: "泊", nights_plural: "泊", summary: "滞在サマリー", total: "現地支払合計金額 (現金のみ)",
      select_room: "お部屋の選択", room_capacity_notice: "⚠️ 注意: 各部屋の最大収容人数は大人2名です。空き状況を確認してください。",
      pricing_notice_seva: "ご奉仕料金: 1名様1泊あたり ¥2,000", pricing_notice_regular: "通常料金: 1部屋1泊あたり ¥7,000", guests_count: "宿泊人数 (信者数)",
    },
    guest: {
      title: "ゲスト情報", extra_title: "同伴者様の情報", full_name: "代表者氏名", age: "年齢", gender: "性別",
      gender_opts: ["女性", "男性", "回答しない"], phone: "電話番号 (10桁)", email: "メールアドレス",
      country: "国", city: "市区町村", address: "住所", id_proof: "パスポート / 身分証明書番号",
      id_file_label: "パスポート / 身分証明書の写真をアップロード",
      first_visit: "ISKCON東京への訪問は初めてですか？", initiated: "ディークシャー（入信）を受けた信者ですか？",
      spiritual_name: "精神的な名前", guru_name: "グルのお名前", yes: "はい", no: "いいえ",
    },
    purpose: {
      title: "訪問の目的と食事", label: "訪問の目的",
      seva: "寺院セーヴァ", seva_desc: "寺院でのボランティア奉仕 (1名様1泊あたり ¥2,000)",
      darshan: "巡礼 / ダルシャン", darshan_desc: "祈りと礼拝のための訪問 (1部屋1泊あたり ¥7,000)",
      retreat: "精神的リトリート", retreat_desc: "精神修行のための長期滞在 (1部屋1泊あたり ¥7,000)",
      prasadam_label: "滞年中、全員毎日お寺のプラサーダム（お食事）を希望されますか？",
      prasadam_desc: "お寺の厳格な時間割に従って提供されます。純粋な菜食の神聖なお食事です。",
      requested_by: "この滞在のリクエスト者", self: "本人", organization: "団体 / 寺院当局", other: "その他",
      recommender_name: "推薦者または団体名", recommender_contact: "連絡先 / 関係",
      medical: "医療上の注意事項（任意）", special: "管理者へのメモや特別なご要望",
    },
    review: {
      title: "確認と確定", stay_details: "滞在の詳細", guest_details: "ゲスト情報",
      purpose_details: "訪問の目的", payment_details: "お支払いについて",
      submit: "予約リクエストを確定",
      pay_note: "オンライン決済は不要です。全額、アシュラム到着時に受付にて現金でお支払いください。",
      disclaimer: "提出されたプロファイル情報、テキスト入力、およびパスポート/身分証明書がすべて正確、有効、かつ合法であることをここに誓います。",
      agree: "以下に同意します：", rules_link: "アシュラムのルールとガイドライン",
    },
    success: {
      title: "リクエストを送信しました！", subtitle: "ハレー・クリシュナ",
      msg: "予約申請が受領されました。先着順で内容を確認の上、承認メールをお送りいたします。",
      ref: "予約番号", total_msg: "到着時お支払い総額:", new_booking: "新しい予約をする",
    },
    nav_lang: "English", next: "Next", back: "戻る", required: "必須項目です", 
    room_note: "マタジはマタジのみ、プラブジはプラブジのみと同室となります。",
  },
};

function formatDate(d) {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDate(s) { 
  if (!s) return null; 
  const [y, m, day] = s.split("-").map(Number); 
  return new Date(y, m - 1, day); 
}

function diffDays(a, b) { 
  if (!a || !b) return 0; 
  return Math.round((b - a) / 86400000); 
}

function genRef() { 
  return "ISK-" + Math.random().toString(36).substring(2, 8).toUpperCase(); 
}

export default function BookingPage() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [step, setStep] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(genRef());
  const [errors, setErrors] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showContact, setShowContact] = useState(false);

  const [cancelId, setCancelId] = useState("");
  const [cancelStatusMsg, setCancelStatusMsg] = useState("");

  // ── 2 ROOMS CONFIGURATION ──
  const ROOMS_CONFIG = [
    { id: "room1", name: "Mataji Ashram (201)" },
    { id: "room2", name: "Prabhuji Ashram (202)" }
  ];

  const [stay, setStay] = useState({ 
    checkin: "", checkin_time: "15:00", checkout: "", checkout_time: "11:00", 
    guestsCount: "1", room1_checked: false, room2_checked: false
  });
  
  const [guest, setGuest] = useState({
    full_name: "", age: "", gender: "", phone: "", email: "",
    country: "", city: "", address: "", id_number: "", id_filename: "",
    first_visit: "", initiated: "", spiritual_name: "", guru_name: ""
  });

  const [coGuests, setCoGuests] = useState([]);
  const [purpose, setPurpose] = useState({ type: "seva", prasadam: "yes", requested_by: "organization", recommender_name: "", recommender_contact: "", medical: "", special: "" });
  const [agreed, setAgreed] = useState(false);
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);

  const todayDate = new Date();
  const maxLimitDate = new Date();
  maxLimitDate.setMonth(maxLimitDate.getMonth() + 3);
  const minDateStr = formatDate(todayDate);
  const maxDateStr = formatDate(maxLimitDate);

  function openRulesPDF() {
    window.open("/ashram_rules.pdf", "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    async function fetchBookingsAndBlocks() { 
      try { 
        const res = await getAllBookings(); 
        setAllBookings(res); 
        
        const blocks = await getBlockedDates();
        setBlockedDates(blocks);
      } catch(e) { 
        console.warn(e); 
      } 
    }
    fetchBookingsAndBlocks();
  }, [submitted, step]);

  function getBlockedDatesInRange(startStr, endStr) {
    if (!startStr || !endStr || startStr >= endStr) return [];
    const blockedInRange = [];
    let cur = parseDate(startStr);
    const end = parseDate(endStr);

    while (cur < end) {
      const curStr = formatDate(cur);
      if (blockedDates.includes(curStr)) {
        blockedInRange.push(curStr);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return blockedInRange;
  }

  const activeBlockedDatesInSelection = getBlockedDatesInRange(stay.checkin, stay.checkout);

  useEffect(() => {
    if (!window.history.state || typeof window.history.state.step !== "number") {
      window.history.replaceState({ step: 0 }, "Step 1");
    }

    const handlePopState = (event) => {
      if (event.state && typeof event.state.step === "number") {
        setStep(event.state.step);
        setSubmitted(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const nights = stay.checkin && stay.checkout ? diffDays(parseDate(stay.checkin), parseDate(stay.checkout)) : 0;
  const guestsNum = parseInt(stay.guestsCount, 10) || 1;
  
  let selectedRoomsCount = 0;
  ROOMS_CONFIG.forEach(rm => { if (stay[rm.id + "_checked"]) selectedRoomsCount += 1; });

  const total = purpose.type === "seva" ? (nights * 2000 * guestsNum) : (nights * 7000 * selectedRoomsCount);

  function getMinAvailableSpotsForRoom(roomId, startStr, endStr) {
    if (!startStr || !endStr || startStr >= endStr) return 2;
    let minSpots = 2;
    let loop = parseDate(startStr);
    const end = parseDate(endStr);

    while (loop < end) {
      const currentStr = formatDate(loop);

      const activeBookingsOnDate = allBookings.filter(b => {
        const st = (b.status || "").toLowerCase();
        const isApproved = st === "approved" || st === "checkedin";
        if (!isApproved || !b.stay) return false;

        return b.stay.checkin <= currentStr && b.stay.checkout > currentStr && b.stay[roomId + "_checked"] === true;
      });

      let spotsTaken = 0;
      activeBookingsOnDate.forEach(b => {
        const totalGuestsInBooking = parseInt(b.stay?.guestsCount, 10) || 1;
        const roomsInBooking = (b.stay?.room1_checked ? 1 : 0) + (b.stay?.room2_checked ? 1 : 0);
        
        if (roomsInBooking > 0) {
          spotsTaken += Math.ceil(totalGuestsInBooking / roomsInBooking);
        } else {
          spotsTaken += 1;
        }
      });

      const spotsLeft = Math.max(0, 2 - spotsTaken);
      if (spotsLeft < minSpots) minSpots = spotsLeft;
      
      loop.setDate(loop.getDate() + 1);
    }
    return minSpots;
  }

  function isEntireAshramFull(startStr, endStr) {
    let totalAvailableSpots = 0;
    ROOMS_CONFIG.forEach(rm => {
      totalAvailableSpots += getMinAvailableSpotsForRoom(rm.id, startStr, endStr);
    });
    return totalAvailableSpots === 0;
  }

  function handleGuestChange(count) {
    const num = parseInt(count, 10) || 1;

    setStay(prev => ({
      ...prev,
      guestsCount: count
    }));

    const extraNeeded = num - 1;
    setCoGuests(prev => {
      const nextCoGuests = [...prev].slice(0, extraNeeded);
      while (nextCoGuests.length < extraNeeded) {
        nextCoGuests.push({ full_name: "", age: "", gender: "", id_number: "", id_filename: "" });
      }
      return nextCoGuests;
    });
  }

  function handlePrimaryGuestInput(field, rawValue) {
    let cleaned = rawValue;
    if (["full_name", "country", "city", "spiritual_name", "guru_name"].includes(field)) {
      cleaned = sanitizeName(rawValue);
    } else if (field === "phone") {
      cleaned = sanitizePhone(rawValue);
    } else if (field === "email") {
      cleaned = sanitizeEmail(rawValue);
    } else if (field === "id_number") {
      cleaned = sanitizeIdNumber(rawValue);
    }
    setGuest(prev => ({ ...prev, [field]: cleaned }));
  }

  function handleCoGuestChange(index, field, rawValue) {
    let cleaned = rawValue;
    if (field === "full_name") {
      cleaned = sanitizeName(rawValue);
    } else if (field === "id_number") {
      cleaned = sanitizeIdNumber(rawValue);
    }
    setCoGuests(prev => { 
      const updated = [...prev]; 
      updated[index] = { ...updated[index], [field]: cleaned }; 
      return updated; 
    });
  }

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!stay.checkin) e.checkin = true;
      if (!stay.checkout) e.checkout = true;
      if (nights <= 0 && stay.checkin && stay.checkout) e.dates = true;
      if (selectedRoomsCount === 0) {
        e.rooms = "select_at_least_one";
      } else if (guestsNum > selectedRoomsCount * 2) {
        e.rooms = "capacity_exceeded";
      }
      
      if (activeBlockedDatesInSelection.length > 0) {
        e.maintenanceBlock = true;
      }

      if (stay.checkin && stay.checkout && !e.dates) {
        let selectedFullRoom = false;
        ROOMS_CONFIG.forEach(rm => {
          if (stay[rm.id + "_checked"]) {
            const spotsAvailable = getMinAvailableSpotsForRoom(rm.id, stay.checkin, stay.checkout);
            if (spotsAvailable === 0) selectedFullRoom = true;
          }
        });
        if (selectedFullRoom) e.waitingListNotice = true;
      }
    }
    if (s === 1) {
      if (!guest.full_name || guest.full_name.trim().length < 2) {
        e.full_name = "Please enter a valid full name.";
      }
      if (!guest.phone || guest.phone.length !== 10) {
        e.phone = "Phone number must be exactly 10 digits.";
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!guest.email || !emailRegex.test(guest.email)) {
        e.email = "Please enter a valid email address.";
      }
      if (!guest.id_number || guest.id_number.trim().length < 5) {
        e.id_number = "Please enter a valid Passport/ID number (at least 5 characters).";
      }
      if (!guest.age || parseInt(guest.age, 10) < 1) {
        e.age = true;
      }
      if (!guest.id_filename) e.primary_id = true;
      if (guest.initiated === "yes" && !guest.spiritual_name) e.spiritual_name = "Spiritual name required.";

      coGuests.forEach((g, idx) => {
        if (!g.full_name || g.full_name.trim().length < 2) e[`cg_${idx}_name`] = "Valid name required.";
        const ageVal = parseInt(String(g.age).trim(), 10);
        if (!g.age || !/^[1-9][0-9]?$/.test(String(g.age).trim()) || isNaN(ageVal) || ageVal < 1 || ageVal > 99) {
          e[`cg_${idx}_age`] = "Valid age required (1–99).";
        }
        if (!g.gender) e[`cg_${idx}_gender`] = true;
        if (!g.id_number) e[`cg_${idx}_idn`] = true;
        if (!g.id_filename) e[`cg_${idx}_id`] = true;
      });
    }
    if (s === 2) { 
      if (!purpose.type) e.type = true; 
    }
    if (s === 3) { 
      if (!agreed) e.agreed = true; 
      if (!agreedDisclaimer) e.agreedDisclaimer = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() { 
    if (validateStep(step)) {
      const nextS = Math.min(step + 1, 3);
      window.history.pushState({ step: nextS }, `Step ${nextS + 1}`);
      setStep(nextS);
    }
  }

  function prevStep() { 
    const prevS = Math.max(step - 1, 0);
    window.history.pushState({ step: prevS }, `Step ${prevS + 1}`);
    setStep(prevS);
  }

  function goToStep(targetIndex) {
    if (targetIndex < step) {
      window.history.pushState({ step: targetIndex }, `Step ${targetIndex + 1}`);
      setStep(targetIndex);
    }
  }
  
  async function handleSubmit() {
    if (validateStep(3)) {
      try {
        const isWaiting = isEntireAshramFull(stay.checkin, stay.checkout);
        const bookingPayload = {
          id: bookingRef,
          stay: stay,
          guest: guest,
          coGuests: coGuests,
          purpose: purpose,
          nights: nights,
          total: total,
          deposit: total,
          balance: 0,
          status: isWaiting ? "waiting" : "pending"
        };

        await submitBooking(bookingPayload);

        sendPendingEmail(bookingPayload).catch(err => {
          console.warn("⚠️ Pending email dispatch failed:", err);
        });

        window.history.replaceState({ step: 0 }, "Confirmed");
        setSubmitted(true);
      } catch(err) {
        alert("Firestore registration link dropped: " + err.message);
      }
    }
  }

  async function triggerPublicCancellation() {
    if (!cancelId.trim()) return;
    setCancelStatusMsg("Processing cancellation query reference...");
    try {
      await cancelBookingPublic(cancelId.trim());
      setCancelStatusMsg("✅ Success. Your booking stay reference has been cleanly canceled.");
      setCancelId("");
    } catch(err) {
      setCancelStatusMsg("❌ Error: " + err.message);
    }
  }

  if (submitted) return (
    <SuccessPage t={t} bookingRef={bookingRef} total={total} lang={lang} onNew={() => { window.location.reload(); }} />
  );

  if (showContact) {
    return <ContactPage lang={lang} onBack={() => setShowContact(false)} />;
  }

  return (
    <div style={{fontFamily:"'Cormorant Garamond', Georgia, serif", minHeight:"100vh", background:"#fdf8f2", color:DEEP}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input,select,textarea { font-family:'Crimson Pro',Georgia,serif; font-size:15px; background:#fff; border:1px solid #e0d4c0; border-radius:6px; padding:9px 12px; width:100%; color:${DEEP}; outline:none; }
        input:focus,select:focus,textarea:focus { border-color:${SAFFRON}; }
        input.err,select.err,textarea.err { border-color:#c0392b; background:#fffdfd; }
        label { font-family:'Crimson Pro',serif; font-size:13px; letter-spacing:0.05em; color:#7a5c3a; text-transform:uppercase; display:block; margin-bottom:4px; }
        .field { margin-bottom:14px; }
        .err-msg { font-size:12px; color:#c0392b; margin-top:3px; font-family:'Crimson Pro',serif; font-weight:500; }
        .radio-opt { display:flex; align-items:center; gap:6px; cursor:pointer; font-family:'Crimson Pro',serif; font-size:15px; padding:8px 14px; border:1px solid #e0d4c0; border-radius:8px; background:#fff; }
        .radio-opt.selected { border-color:${SAFFRON}; background:#fdf0e4; color:${SAFFRON}; font-weight:500; }
        .radio-opt input { display:none; }
        .purpose-card { border:1.5px solid #e0d4c0; border-radius:12px; padding:16px 20px; cursor:pointer; background:#fff; display:flex; align-items:flex-start; gap:14px; margin-bottom:10px; }
        .purpose-card.selected { border-color:${SAFFRON}; background:#fdf0e4; }
        .btn-primary { background:${SAFFRON}; color:#fff; border:none; border-radius:8px; padding:12px 28px; font-family:'Crimson Pro',serif; font-size:16px; cursor:pointer; transition:background 0.2s; }
        .btn-primary:hover { background:#a8450e; }
        .btn-secondary { background:transparent; color:${SAFFRON}; border:1.5px solid ${SAFFRON}; border-radius:8px; padding:11px 24px; font-family:'Crimson Pro',serif; font-size:16px; cursor:pointer; }
        .btn-secondary:hover { background:#fdf0e4; }
        .review-section { background:#fff; border:1px solid #e0d4c0; border-radius:12px; padding:18px 20px; margin-bottom:14px; }
        .review-row { display:flex; justify-content:space-between; padding:5px 0; font-family:'Crimson Pro',serif; font-size:15px; border-bottom:0.5px solid #f0e8d8; }
        .room-chk-card { display:flex; align-items:center; gap:10px; padding:14px; border:1px solid #e0d4c0; border-radius:10px; background:#fff; cursor:pointer; position:relative; }
        .room-chk-card.active { border-color:${SAFFRON}; background:#fdf0e4; }
        .room-chk-card.disabled { opacity: 0.55; cursor: not-allowed; background: #f8f8f8; }
        .guest-sub-block { background:#fff; border:1px solid #e0d4c0; border-radius:12px; padding:20px; margin-bottom:16px; }
        .spot-badge { position:absolute; top:8px; right:8px; font-size:11px; padding:2px 6px; border-radius:4px; font-family:'Crimson Pro',serif; font-weight:500; }

        /* RESPONSIVE SCALING */
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
        .room-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .nav-container { display: flex; justify-content: space-between; align-items: center; min-height: 64px; padding: 10px 20px; background: #1a0a00; border-bottom: 3px solid ${GOLD}; flex-wrap: wrap; gap: 10px; }
        .nav-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .hero-banner { padding: 44px 20px 36px; text-align: center; }
        .hero-title-main { font-size: 3.2rem; }

        @media (max-width: 680px) {
          .form-grid-2 { grid-template-columns: 1fr !important; gap: 12px; }
          .room-grid-2 { grid-template-columns: 1fr !important; gap: 10px; }
          .nav-container { padding: 10px 14px; justify-content: center; }
          .nav-actions { justify-content: center; gap: 8px; width: 100%; }
          .hero-banner { padding: 30px 14px 26px !important; }
          .hero-title-main { font-size: 2.2rem !important; }
          .spot-badge { position: static; margin-left: auto; }
          .room-chk-card { justify-content: space-between; }
        }
      `}</style>

      {/* TOP HEADER MENU */}
      <nav className="nav-container">
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <div style={{fontSize: 22}}>🛕</div> 
          <div style={{borderLeft:"1px solid #5a3a10", paddingLeft:10}}>
            <div style={{color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:14, letterSpacing:"0.08em"}}>ISKCON TOKYO</div>
            <div style={{color:"#c4a56a", fontSize:10, letterSpacing:"0.12em", fontFamily:"'Crimson Pro',serif"}}>ATITHI SEVA NIWAS</div>
          </div>
        </div>
        <div className="nav-actions">
          {["home","rules","contact"].map(k => (
            <button 
              key={k} 
              onClick={() => {
                if (k === "home") setShowContact(false);
                if (k === "rules") openRulesPDF();
                if (k === "contact") setShowContact(true);
              }} 
              style={{background:"none", border:"none", color:"#c4a56a", fontFamily:"'Crimson Pro',serif", fontSize:13, cursor:"pointer", padding:"2px 4px"}}
            >
              {t.nav[k]}
            </button>
          ))}
          <button onClick={() => setShowCancelModal(true)} style={{background:"none", border:`1px dashed ${SAFFRON}`, color:GOLD, padding:"3px 8px", borderRadius:6, fontSize:12, cursor:"pointer"}}>{t.nav.cancel}</button>
          <button onClick={() => setLang(lang==="en"?"ja":"en")} style={{background:"none", border:`1px solid ${GOLD}`, color:GOLD, padding:"3px 8px", borderRadius:6, fontSize:12}}>{t.nav_lang}</button>
        </div>
      </nav>

      {/* HERO MODULE */}
      <div className="hero-banner" style={{background:`linear-gradient(135deg,#1a0a00 0%,#3d1a00 50%,#1a0a00 100%)`, borderBottom:`2px solid ${GOLD}`}}>
        <div style={{color:GOLD, fontSize:13, letterSpacing:"0.2em", marginBottom:10}}>✦ HARE KRISHNA ✦</div>
        <h1 className="hero-title-main" style={{color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontWeight:600, marginBottom:6}}>{t.hero.title}</h1>
        <div style={{color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontStyle:"italic", marginBottom:14}}>{t.hero.subtitle}</div>
        <p style={{color:"#c4a56a", fontFamily:"'Crimson Pro',serif", fontSize:16, maxWidth:500, margin:"0 auto 22px"}}>{t.hero.tagline}</p>
        <div style={{color:"#9a7a4a", fontFamily:"'Crimson Pro',serif", fontSize:13}}>{t.room_note}</div>
      </div>

      {/* HORIZONTAL TIMELINE STEPPER */}
      <div style={{background:"#fff", borderBottom:"1px solid #e0d4c0", padding:"16px 24px"}}>
        <div style={{maxWidth:680, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative"}}>
          <div style={{position:"absolute", top:14, left:"10%", right:"10%", height:1, background:"#e0d4c0", zIndex:0}} />
          {t.steps.map((s,i) => (
            <div key={i} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6, zIndex:1, cursor:i<step?"pointer":"default"}} onClick={() => goToStep(i)}>
              <div style={{width:28, height:28, borderRadius:"50%", background:i<=step?SAFFRON:"#e0d4c0", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12}}>{i<step?"✓":i+1}</div>
              <span style={{fontSize:11, color:i===step?SAFFRON:"#9a7a4a", whiteSpace:"nowrap"}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CORE DISPLAY WINDOW FRAME */}
      <div style={{maxWidth:720, margin:"0 auto", padding:"32px 20px 60px"}}>

        {/* STEP 0: CALENDAR INTERACTION WINDOW */}
        {step===0 && (
          <div>
            <div style={{background:"#fff8f0", border:`1px solid ${GOLD}30`, borderRadius:10, padding:"12px 16px", marginBottom:12, fontFamily:"'Crimson Pro',serif", fontSize:14, color:"#4a3020", lineHeight:"1.5"}}>
              <strong style={{color:SAFFRON}}>🔒 3-Month Bounds Active:</strong> Stays available between {minDateStr} and {maxDateStr} only.
            </div>

            {activeBlockedDatesInSelection.length > 0 && (
              <div style={{
                background: "#fdf0f0",
                border: "1.5px solid #e08080",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                fontFamily: "'Crimson Pro',serif",
                fontSize: 14,
                color: "#c0392b",
                lineHeight: "1.5"
              }}>
                ⚠️ <strong>Maintenance Notice:</strong> {activeBlockedDatesInSelection.join(", ")} is unavailable due to maintenance. Please choose alternative stay dates.
              </div>
            )}

            <div className="form-grid-2">
              <div className="field">
                <label>{t.stay.checkin}</label>
                <input type="date" className={errors.checkin?"err":""} min={minDateStr} max={maxDateStr} value={stay.checkin} onChange={e => setStay(p => ({...p, checkin:e.target.value}))} />
                {errors.checkin && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.stay.checkin_time}</label>
                <select value={stay.checkin_time} onChange={e => setStay(p => ({...p, checkin_time: e.target.value}))}>
                  {["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(tm => <option key={tm} value={tm}>{tm}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t.stay.checkout}</label>
                <input type="date" className={errors.checkout?"err":""} min={stay.checkin||minDateStr} max={maxDateStr} value={stay.checkout} onChange={e => setStay(p => ({...p, checkout:e.target.value}))} />
                {errors.checkout && <div className="err-msg">{t.required}</div>}
              </div>
              <div className="field">
                <label>{t.stay.checkout_time}</label>
                <select value={stay.checkout_time} onChange={e => setStay(p => ({...p, checkout_time: e.target.value}))}>
                  {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"].map(tm => <option key={tm} value={tm}>{tm}</option>)}
                </select>
              </div>
            </div>
            {errors.dates && <div className="err-msg" style={{marginBottom:12}}>Check-out date must follow your selected check-in date.</div>}
            {errors.maintenanceBlock && <div className="err-msg" style={{marginBottom:12, fontWeight:600}}>Cannot proceed: Your selected dates overlap with scheduled maintenance.</div>}
            {errors.waitingListNotice && <div className="err-msg" style={{marginBottom:12, fontWeight:600}}>⚠️ Notice: One or more selected rooms are fully booked for these dates. Proceeding will automatically place your request on our administrative Waiting List.</div>}

            <div className="form-grid-2" style={{marginBottom: 20}}>
              <div className="field">
                <label>{t.stay.guests_count} *</label>
                <select value={stay.guestsCount} onChange={e => handleGuestChange(e.target.value)}>
                  {[1,2,3,4].map(n => <option key={n} value={String(n)}>{n} Devotee(s)</option>)}
                </select>
              </div>
              <div className="field">
                <label>Total Rooms Selected</label>
                <input type="text" value={`${selectedRoomsCount} Room(s) Blocked`} disabled style={{background:"#f5edd650", color:"#7a5c3a", fontWeight:500}} />
              </div>
            </div>

            <div className="field">
              <label>{t.stay.select_room} *</label>
              <div style={{fontSize:13, color:"#a8450e", marginBottom:12}}>{t.stay.room_capacity_notice}</div>
              
              <div className="room-grid-2">
                {ROOMS_CONFIG.map(rm => {
                  const spotsLeft = stay.checkin && stay.checkout ? getMinAvailableSpotsForRoom(rm.id, stay.checkin, stay.checkout) : 2;
                  const isFull = spotsLeft === 0;

                  return (
                    <div 
                      key={rm.id} 
                      className={`room-chk-card${stay[rm.id + "_checked"] ? " active" : ""}${isFull ? " disabled" : ""}`} 
                      onClick={() => {
                        if (!isFull) {
                          setStay(p => ({ ...p, [rm.id + "_checked"]: !p[rm.id + "_checked"] }));
                        }
                      }}
                      style={{ cursor: isFull ? "not-allowed" : "pointer" }}
                    >
                      <input 
                        type="checkbox" 
                        checked={!isFull && stay[rm.id + "_checked"]} 
                        disabled={isFull}
                        onChange={() => {}} 
                        style={{ width: 18, height: 18, cursor: isFull ? "not-allowed" : "pointer" }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: isFull ? "#999" : stay[rm.id + "_checked"] ? SAFFRON : DEEP }}>
                          {rm.name}
                        </div>
                        <div style={{ fontSize: 12, color: isFull ? "#aaa" : "#7a5c3a" }}>Max 2 Adults</div>
                      </div>
                      <span className="spot-badge" style={{
                        background: isFull ? "#fdf0f0" : spotsLeft === 1 ? "#fff8e6" : "#eafaf1",
                        color: isFull ? "#c0392b" : spotsLeft === 1 ? "#8a6010" : "#2e7d52"
                      }}>
                        {isFull ? "Full" : `${spotsLeft} left`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {errors.rooms === "select_at_least_one" && (
                <div className="err-msg">Please select at least one room for your party.</div>
              )}
              {errors.rooms === "capacity_exceeded" && (
                <div className="err-msg">
                  Each room accommodates max 2 adults. Please select both rooms for {guestsNum} guests.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: GUEST REGISTRATION INPUTS */}
        {step===1 && (
          <div>
            <SectionTitle icon="🙏" title={t.guest.title} />
            <div className="guest-sub-block">
              <div style={{fontWeight:600, color:SAFFRON, marginBottom:14, fontSize:16}}>Primary Devotee Profile</div>
              <div className="form-grid-2">
                <div className="field" style={{gridColumn:"1 / -1"}}>
                  <label>{t.guest.full_name} *</label>
                  <input 
                    className={errors.full_name ? "err" : ""} 
                    value={guest.full_name} 
                    onChange={e => handlePrimaryGuestInput("full_name", e.target.value)} 
                    placeholder="e.g. John Smith"
                  />
                  {errors.full_name && <div className="err-msg">{errors.full_name}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.age} *</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    className={errors.age ? "err" : ""} 
                    value={guest.age} 
                    onChange={e => setGuest(p => ({ ...p, age: sanitizeAge(e.target.value) }))} 
                    placeholder="e.g. 25"
                  />
                  {errors.age && <div className="err-msg">{t.required}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.gender} *</label>
                  <select className={errors.gender ? "err" : ""} value={guest.gender} onChange={e => setGuest(p => ({...p, gender: e.target.value}))}>
                    <option value="">—</option>
                    {t.guest.gender_opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.gender && <div className="err-msg">{t.required}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.phone} *</label>
                  <input 
                    type="tel" 
                    maxLength={10}
                    className={errors.phone ? "err" : ""} 
                    value={guest.phone} 
                    onChange={e => handlePrimaryGuestInput("phone", e.target.value)} 
                    placeholder="1234567890"
                  />
                  {errors.phone && <div className="err-msg">{errors.phone}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.email} *</label>
                  <input 
                    type="email" 
                    className={errors.email ? "err" : ""} 
                    value={guest.email} 
                    onChange={e => handlePrimaryGuestInput("email", e.target.value)} 
                    placeholder="name@example.com"
                  />
                  {errors.email && <div className="err-msg">{errors.email}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.country} *</label>
                  <input 
                   className={errors.country ? "err" : ""} 
                   value={guest.country} 
                   onChange={e => handlePrimaryGuestInput("country", e.target.value)} 
                   placeholder="e.g. Japan"
                   />
                   {errors.country && <div className="err-msg">{t.required}</div>}
                </div>

                <div className="field">
                  <label>{t.guest.city} *</label>
                  <input 
                    className={errors.city ? "err" : ""} 
                    value={guest.city} 
                    onChange={e => handlePrimaryGuestInput("city", e.target.value)} 
                    placeholder="e.g. Tokyo"
                  />
                  {errors.city && <div className="err-msg">{t.required}</div>}
                </div>
                <div className="field" style={{gridColumn:"1 / -1"}}>
                  <label>{t.guest.address} *</label>
                  <input className={errors.address ? "err" : ""} value={guest.address} onChange={e => setGuest(p => ({...p, address: e.target.value}))} />
                  {errors.address && <div className="err-msg">{t.required}</div>}
                </div>
                <div className="field">
                  <label>{t.guest.id_proof} *</label>
                  <input 
                    className={errors.id_number ? "err" : ""} 
                    value={guest.id_number} 
                    onChange={e => handlePrimaryGuestInput("id_number", e.target.value)} 
                    placeholder="Passport / Residence Card ID" 
                  />
                  {errors.id_number && <div className="err-msg">{t.required}</div>}
                </div>
                <div className="field" style={{background:"#fcf9f2", padding:10, borderRadius:8, border:"1px dashed #e0d4c0"}}>
                  <label>{t.guest.id_file_label} *</label>
                  <input type="file" accept="image/*,application/pdf" onChange={e => e.target.files[0] && setGuest(p => ({...p, id_filename: e.target.files[0].name}))} />
                  {guest.id_filename && <span style={{fontSize:13, color:"#2e7d52", display:"block", marginTop:4}}>📄 Uploaded: {guest.id_filename}</span>}
                  {errors.primary_id && <div className="err-msg">{t.required}</div>}
                </div>
              </div>

              {[{key:"first_visit",label:t.guest.first_visit},{key:"initiated",label:t.guest.initiated}].map(({key,label}) => (
                <div key={key} className="field" style={{marginTop:12}}>
                  <label>{label} *</label>
                  <div style={{display:"flex", gap:10}}>
                    {["yes","no"].map(v => (
                      <label key={v} className={`radio-opt${guest[key]===v?" selected":""}`} onClick={() => setGuest(p => ({...p,[key]:v}))}>
                        <input type="radio" checked={guest[key]===v} onChange={()=>{}} />
                        {v==="yes"?t.guest.yes:t.guest.no}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {guest.initiated==="yes" && (
                <div className="form-grid-2" style={{marginTop:10}}>
                  <div className="field">
                    <label>{t.guest.spiritual_name} *</label>
                    <input className={errors.spiritual_name ? "err" : ""} value={guest.spiritual_name} onChange={e => handlePrimaryGuestInput("spiritual_name", e.target.value)} />
                    {errors.spiritual_name && <div className="err-msg">{errors.spiritual_name}</div>}
                  </div>
                  <div className="field">
                    <label>{t.guest.guru_name}</label>
                    <input value={guest.guru_name} onChange={e => handlePrimaryGuestInput("guru_name", e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {coGuests.map((g, idx) => (
              <div key={idx} className="guest-sub-block" style={{borderLeft:`3px solid ${GOLD}`}}>
                <div style={{fontWeight:600, color:DEEP, marginBottom:12, fontSize:15}}>👤 {t.guest.extra_title} #{idx+2}</div>
                <div className="form-grid-2">
                  <div className="field" style={{gridColumn:"1 / -1"}}>
                    <label>{t.guest.full_name} *</label>
                    <input className={errors[`cg_${idx}_name`] ? "err" : ""} value={g.full_name} onChange={e => handleCoGuestChange(idx, "full_name", e.target.value)} />
                    {errors[`cg_${idx}_name`] && <div className="err-msg">{errors[`cg_${idx}_name`]}</div>}
                  </div>
                  <div className="field">
                    <label>{t.guest.age} *</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      className={errors[`cg_${idx}_age`] ? "err" : ""} 
                      value={g.age} 
                      onChange={e => handleCoGuestChange(idx, "age", sanitizeAge(e.target.value))} 
                      placeholder="e.g. 25"
                    />
                    {errors[`cg_${idx}_age`] && <div className="err-msg">{t.required}</div>}
                  </div>
                  <div className="field">
                    <label>{t.guest.gender} *</label>
                    <select className={errors[`cg_${idx}_gender`] ? "err" : ""} value={g.gender} onChange={e => handleCoGuestChange(idx, "gender", e.target.value)}>
                      <option value="">—</option>
                      {t.guest.gender_opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors[`cg_${idx}_gender`] && <div className="err-msg">{t.required}</div>}
                  </div>
                  <div className="field">
                    <label>Passport / ID Doc Number *</label>
                    <input className={errors[`cg_${idx}_idn`] ? "err" : ""} value={g.id_number} onChange={e => handleCoGuestChange(idx, "id_number", e.target.value)} />
                    {errors[`cg_${idx}_idn`] && <div className="err-msg">{t.required}</div>}
                  </div>
                  <div className="field" style={{background:"#fcf9f2", padding:10, borderRadius:6, border:"1px dashed #e0d4c0"}}>
                    <label>Upload ID Photo *</label>
                    <input type="file" accept="image/*,application/pdf" onChange={e => e.target.files[0] && handleCoGuestChange(idx, "id_filename", e.target.files[0].name)} />
                    {g.id_filename && <span style={{fontSize:13, color:"#2e7d52", display:"block", marginTop:4}}>📄 Uploaded: {g.id_filename}</span>}
                    {errors[`cg_${idx}_id`] && <div className="err-msg">{t.required}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: PURPOSE OF VISIT */}
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
                  <div 
                    key={p.id} 
                    className={`purpose-card${purpose.type===p.id?" selected":""}`} 
                    onClick={() => {
                      setPurpose(prev => ({
                        ...prev,
                        type: p.id,
                        requested_by: p.id === "seva" ? "organization" : prev.requested_by
                      }));
                    }}
                  >
                    <div style={{width:42, height:42, borderRadius:"50%", background:purpose.type===p.id?"#fdf0e4":"#f9f3eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0}}>{p.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, fontSize:16, color:purpose.type===p.id?SAFFRON:DEEP}}>{p.title}</div>
                      <div style={{fontSize:14, color:"#7a5c3a", marginTop:2}}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {purpose.type === "seva" && (
              <div style={{marginTop:16, marginBottom:16}}>
                <div className="field">
                  <label>{t.purpose.requested_by}</label>
                  <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                    {[["organization",t.purpose.organization],["other",t.purpose.other]].map(([v,label]) => (
                      <label key={v} className={`radio-opt${purpose.requested_by===v?" selected":""}`} onClick={() => setPurpose(p => ({...p,requested_by:v}))}>
                        <input type="radio" checked={purpose.requested_by===v} onChange={()=>{}} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                {(purpose.requested_by==="organization"||purpose.requested_by==="other") && (
                  <div className="form-grid-2" style={{marginTop:12}}>
                    <div className="field"><label>{t.purpose.recommender_name} *</label><input value={purpose.recommender_name} onChange={e => setPurpose(p => ({...p,recommender_name:e.target.value}))} /></div>
                    <div className="field"><label>{t.purpose.recommender_contact} *</label><input value={purpose.recommender_contact} onChange={e => setPurpose(p => ({...p,recommender_contact:e.target.value}))} /></div>
                  </div>
                )}
              </div>
            )}

            <div className="field" style={{background:"#fff", border:"1px solid #e0d4c0", borderRadius:12, padding:18, marginTop:20}}>
              <label style={{fontSize:14, color:DEEP, fontWeight:600, textTransform:"none"}}>{t.purpose.prasadam_label} *</label>
              <div style={{fontSize:13, color:"#7a5c3a", marginBottom:12}}>{t.purpose.prasadam_desc}</div>
              <div style={{display:"flex", gap:12}}>
                <button className="btn-secondary" style={{background:purpose.prasadam==="yes"?SAFFRON:"transparent", color:purpose.prasadam==="yes"?"#fff":SAFFRON, padding:"8px 24px"}} onClick={() => setPurpose(p => ({...p, prasadam:"yes"}))}>{t.guest.yes}</button>
                <button className="btn-secondary" style={{background:purpose.prasadam==="no"?SAFFRON:"transparent", color:purpose.prasadam==="no"?"#fff":SAFFRON, padding:"8px 24px"}} onClick={() => setPurpose(p => ({...p, prasadam:"no"}))}>{t.guest.no}</button>
              </div>
            </div>

            <div className="field" style={{marginTop:14}}><label>{t.purpose.medical}</label><textarea rows={2} value={purpose.medical} onChange={e => setPurpose(p => ({...p,medical:e.target.value}))} /></div>
            <div className="field"><label>{t.purpose.special}</label><textarea rows={3} value={purpose.special} onChange={e => setPurpose(p => ({...p,special:e.target.value}))} /></div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step===3 && (
          <div>
            <SectionTitle icon="📋" title={t.review.title} />

            <div className="review-section">
              <div style={{fontWeight:600, fontSize:15, marginBottom:10, color:"#7a5c3a"}}>{t.review.stay_details}</div>
              <div className="review-row"><span>Check-in Block:</span><strong>{stay.checkin} @ {stay.checkin_time}</strong></div>
              <div className="review-row"><span>Check-out Block:</span><strong>{stay.checkout} @ {stay.checkout_time}</strong></div>
              <div className="review-row"><span>Total Guests:</span><strong>{guestsNum} Devotee(s)</strong></div>
              <div className="review-row"><span>Rooms Blocked:</span><strong>{ROOMS_CONFIG.map(rm => stay[rm.id + "_checked"] ? rm.name + " " : "")}</strong></div>
            </div>

            <div className="review-section">
              <div style={{fontWeight:600, fontSize:15, marginBottom:10, color:"#7a5c3a"}}>{t.review.guest_details}</div>
              <div className="review-row"><span>{t.guest.full_name}:</span><strong>{guest.full_name}</strong></div>
              <div className="review-row"><span>Phone Number:</span><strong>+91 {guest.phone}</strong></div>
              <div className="review-row"><span>Email Address:</span><strong>{guest.email}</strong></div>
              <div className="review-row"><span>Passport / ID Document:</span><strong>{guest.id_number} (✓ {guest.id_filename})</strong></div>
            </div>

            <div style={{background:"#fff9f3", border:`1px solid ${GOLD}40`, borderRadius:12, padding:"18px 20px", marginBottom:18}}>
              <div style={{fontWeight:600, fontSize:16, marginBottom:6, color:SAFFRON}}>💴 {t.review.payment_details}</div>
              <div style={{fontSize:14, color:"#7a5c3a", marginBottom:14}}>{t.review.pay_note}</div>
              <div style={{display:"flex", justifyContent:"space-between", padding:"6px 0", borderTop:"1px dashed #e0d4c0", marginTop:10}}>
                <span style={{fontSize:16, fontWeight:600}}>{t.stay.total}:</span>
                <span style={{fontSize:20, fontWeight:700, color:DEEP}}>¥{total.toLocaleString()}</span>
              </div>
            </div>

            <div style={{display:"flex", alignItems:"flex-start", gap:10, marginBottom:12}}>
              <input type="checkbox" id="disclaimer_chk" checked={agreedDisclaimer} onChange={e => setAgreedDisclaimer(e.target.checked)} style={{width:18, height:18, marginTop:2, cursor:"pointer"}} />
              <label htmlFor="disclaimer_chk" style={{textTransform:"none", color:DEEP, cursor:"pointer", fontSize:14, fontWeight:500}}>
                {t.review.disclaimer}
              </label>
            </div>
            {errors.agreedDisclaimer && <div className="err-msg" style={{marginBottom:10}}>You must explicitly verify your documents are valid to proceed.</div>}

            <div style={{display:"flex", alignItems:"flex-start", gap:10, marginBottom:18}}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{width:18, height:18, marginTop:2, cursor:"pointer"}} />
              <label htmlFor="agree" style={{textTransform:"none", color:DEEP, cursor:"pointer", fontSize:14}}>
                {t.review.agree} <button onClick={openRulesPDF} style={{background:"none", border:"none", color:SAFFRON, cursor:"pointer", fontSize:14, textDecoration:"underline"}}>{t.review.rules_link}</button>
              </label>
            </div>
            {errors.agreed && <div className="err-msg" style={{marginBottom:10}}>{lang==="en"?"Please agree to the ashram guidelines.":"アシュラムのルールに同意してください。"}</div>}
          </div>
        )}

        {/* STEP NAVIGATION FOOTER BUTTONS */}
        <div style={{display:"flex", justifyContent:"space-between", marginTop:28, gap:12}}>
          {step>0 ? <button className="btn-secondary" onClick={prevStep}>{t.back}</button> : <div />}
          {step<3
            ? <button className="btn-primary" onClick={nextStep}>{t.next} →</button>
            : <button className="btn-primary" onClick={handleSubmit} style={{background:"#2e7d52"}}>{t.review.submit} ✓</button>
          }
        </div>
      </div>

      {/* CANCELLATION OVERLAY INTERFACE */}
      {showCancelModal && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
          <div style={{background:"#fff", borderRadius:14, maxWidth:440, width:"100%", padding:24}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:14}}>
              <h3 style={{fontSize:20, color:SAFFRON, fontWeight:600}}>Cancel Ashram Stay</h3>
              <button onClick={() => { setShowCancelModal(false); setCancelStatusMsg(""); }} style={{background:"none", border:"none", fontSize:20, cursor:"pointer"}}>✕</button>
            </div>
            <p style={{fontSize:14, color:"#7a5c3a", marginBottom:16, lineHeight:1.5}}>Please provide your absolute system reference code string (e.g., ISK-XXXXXX) to wipe out your active blocked room nodes.</p>
            <div className="field">
              <label>Booking Reference Code ID</label>
              <input type="text" value={cancelId} onChange={e => setCancelId(e.target.value)} placeholder="ISK-XXXXXX" style={{textTransform:"uppercase"}} />
            </div>
            {cancelStatusMsg && <div style={{fontSize:14, marginTop:10, marginBottom:14, padding:"8px 12px", borderRadius:6, background:"#fbf3eb", color:DEEP}}>{cancelStatusMsg}</div>}
            <button className="btn-primary" onClick={triggerPublicCancellation} style={{width:"100%", background:"#c0392b"}}>Process Cancellation Request</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{background:DEEP, borderTop:`2px solid ${GOLD}`, padding:"24px 16px", textAlign:"center"}}>
        <div style={{color:GOLD, fontSize:12, letterSpacing:"0.12em", marginBottom:6}}>Hare Krishna Hare Krishna Krishna Krishna Hare Hare; Hare Rama Hare Rama Rama Rama Hare Hare</div>
        <div style={{color:"#7a5c3a", fontSize:12}}>ISKCON Tokyo Atithi Seva Niwas · © 2026</div>
      </div>
    </div>
  );
}

function SectionTitle({icon,title}) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:22, paddingBottom:12, borderBottom:"1.5px solid #f0e8d8"}}>
      <span style={{fontSize:22}}>{icon}</span>
      <h2 style={{fontSize:22, fontWeight:600, color:DEEP}}>{title}</h2>
    </div>
  );
}

function SuccessPage({t,bookingRef,total,onNew}) {
  return (
    <div style={{minHeight:"100vh", background:"#fdf8f2", display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
      <div style={{maxWidth:500, width:"100%", textAlign:"center"}}>
        <div style={{fontSize: 48, marginBottom: 14}}>🛕</div>
        <h1 style={{fontSize:"2.2rem", fontWeight:600, color:DEEP, marginBottom:16}}>{t.success.title}</h1>
        <p style={{fontSize:16, color:"#4a3020", lineHeight:1.7, marginBottom:24}}>{t.success.msg}</p>
        <div style={{background:"#fff", border:`1.5px solid ${GOLD}60`, borderRadius:12, padding:"20px 24px", marginBottom:24}}>
          <div style={{fontSize:13, color:"#7a5c3a", marginBottom:4}}>{t.success.ref}</div>
          <div style={{fontSize:26, fontWeight:600, color:SAFFRON, letterSpacing:"0.1em"}}>{bookingRef}</div>
          <div style={{fontSize:14, color:"#7a5c3a", marginTop:10}}>{t.success.total_msg} <strong>¥{total.toLocaleString()} (Cash Only)</strong></div>
        </div>
        <button onClick={onNew} style={{background:SAFFRON, color:"#fff", border:"none", borderRadius:8, padding:"12px 28px", fontSize:16, cursor:"pointer"}}>{t.success.new_booking}</button>
      </div>
    </div>
  );
}