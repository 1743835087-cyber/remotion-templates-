import React from "react";

export const HeaderBar: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 60,
      }}
    >
      {/* Left side title */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Leftmost dash line */}
        <div
          style={{
            width: 36,
            height: 3,
            backgroundColor: "#FF5C93",
            borderRadius: 2,
          }}
        />

        {/* 小白测评 badge text */}
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#FF5C93",
            letterSpacing: 1.5,
            textShadow: "0 0 15px rgba(255, 92, 147, 0.4)",
          }}
        >
          「小白测评」
        </span>

        {/* Master benchmark title */}
        <span
          style={{
            fontSize: 34,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
          }}
        >
          185Hz 超高刷 三角洲行动 多场景测试
        </span>

        {/* 5.5 Database Version Tag */}
        <div
          style={{
            padding: "4px 14px",
            borderRadius: 6,
            background: "linear-gradient(135deg, #B71C5C 0%, #E91E63 100%)",
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 1,
            boxShadow: "0 2px 10px rgba(233, 30, 99, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          5.5
        </div>
      </div>

      {/* Right side: 100% Vector S.White Review Database Logo Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#0A0D12",
          border: "1.5px solid rgba(255, 255, 255, 0.8)",
          borderRadius: 6,
          padding: "5px 12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Crest icon */}
        <svg width="22" height="26" viewBox="0 0 24 28" fill="none">
          <path
            d="M12 2L2 6V14C2 20 12 26 12 26C12 26 22 20 22 14V6L12 2Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M6 10L10 17L12 13L14 17L18 10"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Text lockup */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 0.8,
              lineHeight: 1,
            }}
          >
            S.White Review
          </span>
          <div
            style={{
              background: "#FFFFFF",
              color: "#000000",
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 2,
              padding: "1px 4px",
              borderRadius: 2,
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            DATABASE
          </div>
        </div>
      </div>
    </div>
  );
};
