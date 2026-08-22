// src/components/ContactPage.jsx
import React from "react";

const SAFFRON = "#C4581A";
const GOLD = "#D4A017";
const DEEP = "#1a0a00";

export default function ContactPage({ lang = "en", onBack }) {
  const isEn = lang === "en";

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", minHeight: "100vh", background: "#fdf8f2", color: DEEP }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .contact-card {
          background: #fff;
          border: 1px solid #e0d4c0;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .nav-bar-contact {
          background: #1a0a00;
          border-bottom: 3px solid ${GOLD};
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
          .contact-container {
            padding: 20px 14px 40px !important;
          }
          .hero-title {
            font-size: 2.2rem !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <nav className="nav-bar-contact">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🛕</span>
          <div style={{ borderLeft: "1px solid #5a3a10", paddingLeft: 10 }}>
            <div style={{ color: GOLD, fontWeight: 600, fontSize: 14, letterSpacing: "0.08em" }}>ISKCON TOKYO</div>
            <div style={{ color: "#c4a56a", fontSize: 10, letterSpacing: "0.12em", fontFamily: "'Crimson Pro',serif" }}>ATITHI SEVA NIWAS</div>
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            background: SAFFRON,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontFamily: "'Crimson Pro',serif",
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 500,
            whiteSpace: "nowrap"
          }}
        >
          {isEn ? "← Back to Booking" : "← 予約へ戻る"}
        </button>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#1a0a00 0%,#3d1a00 50%,#1a0a00 100%)", padding: "40px 20px 32px", textAlign: "center", borderBottom: `2px solid ${GOLD}` }}>
        <div style={{ color: GOLD, fontSize: 13, letterSpacing: "0.2em", marginBottom: 8 }}>✦ HARE KRISHNA ✦</div>
        <h1 className="hero-title" style={{ color: "#fff", fontSize: "2.8rem", fontWeight: 600, marginBottom: 6 }}>
          {isEn ? "Contact Us" : "お問い合わせ"}
        </h1>
        <p style={{ color: "#c4a56a", fontFamily: "'Crimson Pro',serif", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
          {isEn ? "Get in touch with ISKCON Tokyo Atithi Seva Niwas" : "ISKCON東京 アティティ・セーヴァ・ニワスへのお問い合わせ"}
        </p>
      </div>

      {/* BODY CARDS */}
      <div className="contact-container" style={{ maxWidth: 840, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div className="contact-grid">
          {/* Card 1: Address & Station */}
          <div className="contact-card">
            <div style={{ fontSize: 24 }}>📍</div>
            <h3 style={{ fontSize: 19, fontWeight: 600, color: SAFFRON }}>
              {isEn ? "Temple & Ashram Address" : "寺院・アシュラムの所在地"}
            </h3>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.6, color: DEEP }}>
              <strong>ISKCON Tokyo</strong><br />
              2-23-4 Funabori, Edogawa-ku,<br />
              Tokyo 134-0091, Japan
            </div>
            <div style={{ borderTop: "1px dashed #e0d4c0", paddingTop: 10, marginTop: 4, fontFamily: "'Crimson Pro',serif", fontSize: 14, color: "#7a5c3a" }}>
              🚇 <strong>{isEn ? "Nearest Station:" : "最寄駅:"}</strong><br />
              {isEn ? "2 mins walk from Funabori Station (Toei Shinjuku Line, South Gate)" : "都営新宿線「船堀駅」南口より徒歩2分"}
            </div>
          </div>

          {/* Card 2: Contact Details */}
          <div className="contact-card">
            <div style={{ fontSize: 24 }}>📞</div>
            <h3 style={{ fontSize: 19, fontWeight: 600, color: SAFFRON }}>
              {isEn ? "Contact Details" : "連絡先"}
            </h3>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.8, color: DEEP }}>
              <div><strong>{isEn ? "Phone:" : "電話番号:"}</strong> +81 3-3877-3000</div>
              <div><strong>{isEn ? "Email:" : "メール:"}</strong> <a href="mailto:iskcon.new.gaya.japan@gmail.com" style={{ color: SAFFRON, textDecoration: "none" }}>iskcon.new.gaya.japan@gmail.com</a></div>
              <div><strong>{isEn ? "Website:" : "ウェブサイト:"}</strong> <a href="https://www.iskconjapan.com" target="_blank" rel="noreferrer" style={{ color: SAFFRON, textDecoration: "none" }}>www.iskconjapan.com</a></div>
            </div>
          </div>

          {/* Card 3: Temple Timings */}
          <div className="contact-card">
            <div style={{ fontSize: 24 }}>⏰</div>
            <h3 style={{ fontSize: 19, fontWeight: 600, color: SAFFRON }}>
              {isEn ? "Daily Temple Timings" : "寺院のスケジュール"}
            </h3>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.7, color: DEEP }}>
              <div><strong>Mangala Arati:</strong> 5:30 AM</div>
              <div><strong>Darshan Hours:</strong> 8:00 AM – 1:00 PM & 4:00 PM – 8:00 PM</div>
              <div><strong>Evening Arati:</strong> 7:00 PM</div>
            </div>
          </div>

          {/* Card 4: Ashram Guidelines */}
          <div className="contact-card">
            <div style={{ fontSize: 24 }}>🌸</div>
            <h3 style={{ fontSize: 19, fontWeight: 600, color: SAFFRON }}>
              {isEn ? "Ashram Guidelines" : "アシュラムのご案内"}
            </h3>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.6, color: "#5a402a" }}>
              {isEn
                ? "Matajis (female devotees) share rooms exclusively with Matajis, and Prabhujis (male devotees) share rooms exclusively with Prabhujis. For group visits or special requests, please email us at least 2 weeks in advance."
                : "マタジ（女性信者）はマタジのみ、プラブジ（男性信者）はプラブジのみと同室となります。団体利用や特別なご要望は2週間前までにご連絡ください。"}
            </div>
          </div>
        </div>

        {/* Location Map */}
        <div style={{ background: "#fff", border: "1px solid #e0d4c0", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: SAFFRON }}>🗺️ {isEn ? "Location Map" : "地図"}</h3>
            <a
              href="https://maps.google.com/?q=2-23-4+Funabori+Edogawa-ku+Tokyo"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#fdf0e4",
                border: `1px solid ${SAFFRON}`,
                color: SAFFRON,
                padding: "6px 14px",
                borderRadius: 6,
                fontFamily: "'Crimson Pro',serif",
                fontSize: 13,
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              {isEn ? "Open in Google Maps ↗" : "Googleマップで開く ↗"}
            </a>
          </div>
          <iframe
            title="ISKCON Tokyo Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.824707166113!2d139.8624131!3d35.6813084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601887e5b5655555%3A0x8670d65bceef34b1!2sISKCON%20Tokyo!5e0!3m2!1sen!2sjp!4v1700000000000"
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: 8 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: DEEP, borderTop: `2px solid ${GOLD}`, padding: "24px 16px", textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 12, letterSpacing: "0.12em", marginBottom: 6 }}>
          Hare Krishna Hare Krishna Krishna Krishna Hare Hare; Hare Rama Hare Rama Rama Rama Hare Hare
        </div>
        <div style={{ color: "#7a5c3a", fontSize: 12 }}>ISKCON Tokyo Atithi Seva Niwas · © 2026</div>
      </div>
    </div>
  );
}