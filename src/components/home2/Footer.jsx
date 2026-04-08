import React from "react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #1a1a1a",
      padding: "48px 2rem 36px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "48px",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span style={{ color: "#f59e0b", fontSize: "16px", fontWeight: 800 }}>•</span>
              <span style={{ color: "#f0f0f0", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>CodeFlow</span>
            </div>
            <div style={{ color: "#525252", fontSize: "13px", fontFamily: "monospace" }}>
              Learn AI. Build things.
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "28px" }}>
            {["Twitter", "GitHub", "Contact"].map(link => (
              <a
                key={link}
                href="#"
                style={{ color: "#525252", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#a3a3a3"}
                onMouseLeave={e => e.currentTarget.style.color = "#525252"}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "24px",
          color: "#333",
          fontSize: "12px",
          fontFamily: "monospace",
        }}>
          © 2025 CodeFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}