import React from "react";

const SAFFRON = "#C4581A";
const GOLD    = "#D4A017";
const DEEP    = "#1a0a00";

export default function ContactPage({ onBack, lang = "en" }) {
  const isEn = lang === "en";

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", minHeight: "100vh", background: "#fdf8f2", color: DEEP }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .contact-card { background: #fff; border: 1px solid #e0d4c0; border-radius: 12px; padding: 24px; margin-bottom: 20px; transition: border-color 0.2s; }
        .contact-card:hover { border-color: ${SAFFRON}; }
        .btn-primary { background: ${SAFFRON}; color: #fff; border: none; border-radius: 8px; padding: 10px 24px; font-family: 'Crimson Pro', serif; font-size: 15px; cursor: pointer; }
        .btn-primary:hover { background: #a8450e; }
      `}</style>

      {/* HEADER NAVBAR */}
      <nav style={{ background: DEEP, borderBottom: `3px solid ${GOLD}`, padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 24 }}>🛕</div> 
          <div style={{ borderLeft: "1px solid #5a3a10", paddingLeft: 14 }}>
            <div style={{ color: GOLD, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 15, letterSpacing: "0.08em" }}>ISKCON TOKYO</div>
            <div style={{ color: "#c4a56a", fontSize: 11, letterSpacing: "0.14em", fontFamily: "'Crimson Pro',serif" }}>MATAJI ASHRAM</div>
          </div>
        </div>
        <button onClick={onBack} className="btn-primary">
          {isEn ? "← Back to Booking" : "← 予約ページに戻る"}
        </button>
      </nav>

      {/* HERO BANNER */}
      <div style={{ background: `linear-gradient(135deg,#1a0a00 0%,#3d1a00 50%,#1a0a00 100%)`, padding: "48px 24px 38px", textAlign: "center", borderBottom: `2px solid ${GOLD}` }}>
        <div style={{ color: GOLD, fontSize: 13, letterSpacing: "0.2em", marginBottom: 10 }}>✦ HARE KRISHNA ✦</div>
        <h1 style={{ color: "#fff", fontFamily: "'Cormorant Garamond',serif", fontSize: "2.8rem", fontWeight: 600, marginBottom: 6 }}>
          {isEn ? "Contact Us" : "お問い合わせ"}
        </h1>
        <p style={{ color: "#c4a56a", fontFamily: "'Crimson Pro',serif", fontSize: 16 }}>
          {isEn ? "Get in touch with ISKCON Tokyo & Mataji Ashram" : "ISKCON東京・マタジ・アシュラムへのお問い合わせ"}
        </p>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 20px 60px", fontFamily: "'Crimson Pro', serif" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          
          {/* ADDRESS & LOCATION */}
          <div className="contact-card">
            <div style={{ fontSize: 28, marginBottom: 10 }}>📍</div>
            <h3 style={{ fontSize: 18, color: SAFFRON, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              {isEn ? "Temple & Ashram Address" : "所在地"}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: DEEP }}>
              <strong>ISKCON Tokyo</strong><br />
              2-23-4 Funabori, Edogawa-ku,<br />
              Tokyo 134-0091, Japan
            </p>
            <div style={{ marginTop: 12, fontSize: 13, color: "#7a5c3a" }}>
              🚆 {isEn ? "2 mins walk from Funabori Station on Toei Shinjuku Line (South Gate)" : "船堀駅（都営新宿線）より徒歩5分"}
            </div>
          </div>

          {/* PHONE & EMAIL */}
          <div className="contact-card">
            <div style={{ fontSize: 28, marginBottom: 10 }}>📞</div>
            <h3 style={{ fontSize: 18, color: SAFFRON, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              {isEn ? "Contact Details" : "連絡先"}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: DEEP }}>
              <strong>Phone:</strong> <a href="tel:+81356763731" style={{ color: SAFFRON, textDecoration: "none" }}>+81 3-3877-3000</a><br />
              <strong>Email:</strong> <a href="mailto:info@iskcontokyo.org" style={{ color: SAFFRON, textDecoration: "none" }}>iskcon.new.gaya.japan@gmail.com</a><br />
              <strong>Website:</strong> <a href="https://www.iskconjapan.com" target="_blank" rel="noreferrer" style={{ color: SAFFRON, textDecoration: "none" }}>www.iskconjapan.com</a>
            </p>
          </div>

          {/* TEMPLE TIMINGS */}
          <div className="contact-card">
            <div style={{ fontSize: 28, marginBottom: 10 }}>⏰</div>
            <h3 style={{ fontSize: 18, color: SAFFRON, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              {isEn ? "Daily Temple Timings" : "参拝時間"}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: DEEP }}>
              <strong>Mangala Arati:</strong> 5:30 AM<br />
              <strong>Darshan Hours:</strong> 08:00 AM – 13:00 PM & 16:00 PM – 20:00 PM<br />
              <strong>Evening Arati:</strong> 19:00 PM<br />
            </p>
          </div>

            {/* ASHRAM GUIDELINES ENQUIRIES */}
            <div className="contact-card">
            <div style={{ fontSize: 28, marginBottom: 10 }}>🌸</div>
            <h3 style={{ fontSize: 18, color: SAFFRON, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                {isEn ? "Ashram Guidelines" : "アシュラムのご案内"}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#7a5c3a" }}>
                {isEn 
                ? "Matajis (female devotees) will share rooms exclusively with Matajis, and Prabhujis (male devotees) will share rooms exclusively with Prabhujis. For group visits or special requests, please email us at least 2 weeks in advance."
                : "マタジ（女性信者）はマタジのみ、プラブジ（男性信者）はプラブジのみと同室となります。団体でのご参拝や特別なご要望がある場合は、少なくとも2週間前までにメールにてご連絡ください。"}
            </p>
            </div>

        </div>

        {/* GOOGLE MAPS EMBED */}
        <div style={{ marginTop: 10, background: "#fff", border: "1px solid #e0d4c0", borderRadius: 12, padding: 16, overflow: "hidden" }}>
          <h3 style={{ fontSize: 18, color: SAFFRON, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            🗺️ {isEn ? "Location Map" : "アクセスマップ"}
          </h3>
          <iframe
            title="ISKCON Tokyo Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.852109820573!2d139.8624131!3d35.6806509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188812610531b7%3A0x7d65bb471baec165!2sISKCON%20Tokyo!5e0!3m2!1sen!2sjp!4v1700000000000!5m2!1sen!2sjp"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: 8 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: DEEP, borderTop: `2px solid ${GOLD}`, padding: "24px", textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 12, letterSpacing: "0.12em", marginBottom: 6 }}>
          Hare Krishna Hare Krishna Krishna Krishna Hare Hare; Hare Rama Hare Rama Rama Rama Hare Hare
        </div>
        <div style={{ color: "#7a5c3a", fontSize: 12 }}>ISKCON Tokyo Mataji Ashram · © 2026</div>
      </div>
    </div>
  );
}