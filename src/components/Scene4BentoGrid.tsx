import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Home, Building2, Store, Sparkles, MoveRight } from "lucide-react";

export const Scene4BentoGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance
  const headerSpring = spring({ frame, fps, config: { damping: 14 } });

  // 4 Cards staggered entrances
  const card1Spring = spring({ frame: frame - 10, fps, config: { damping: 13, mass: 0.7 } });
  const card2Spring = spring({ frame: frame - 18, fps, config: { damping: 13, mass: 0.7 } });
  const card3Spring = spring({ frame: frame - 26, fps, config: { damping: 13, mass: 0.7 } });
  const card4Spring = spring({ frame: frame - 34, fps, config: { damping: 13, mass: 0.7 } });

  // Exit transition
  const exitOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [105, 120], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          opacity: headerSpring,
          transform: `translateY(${(1 - headerSpring) * -30}px)`,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 18px",
            borderRadius: 20,
            background: "rgba(0, 245, 255, 0.1)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            color: "#00F5FF",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <Sparkles size={18} />
          全场景赋能 · 随时随地
        </div>
        <h2
          style={{
            fontSize: 50,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
          }}
        >
          你的千兆网络 · 从此不再被网线绑架
        </h2>
      </div>

      {/* Bento Grid (2x2 with asymmetric spans) */}
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gridTemplateRows: "210px 210px",
          gap: 24,
        }}
      >
        {/* Card 1: 租房青年 & 合租家庭 */}
        <div
          style={{
            opacity: card1Spring,
            transform: `scale(${card1Spring}) translateY(${(1 - card1Spring) * 30}px)`,
            padding: "28px 32px",
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(15, 30, 50, 0.7) 0%, rgba(10, 18, 30, 0.85) 100%)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#00F5FF",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                SCENARIO 01 / 租房焕新
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>
                房东不给拉宽带？一拔就走！
              </h3>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(0, 245, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00F5FF",
              }}
            >
              <Home size={26} />
            </div>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}>
            告别传统宽带 2 年合约捆绑与拆机移机费。换房搬家只需装进背包，到新家通电依然千兆高速。
          </p>
        </div>

        {/* Card 2: 商务办公与快闪门店 */}
        <div
          style={{
            opacity: card2Spring,
            transform: `scale(${card2Spring}) translateY(${(1 - card2Spring) * 30}px)`,
            padding: "28px 32px",
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(20, 35, 45, 0.7) 0%, rgba(10, 22, 25, 0.85) 100%)",
            border: "1px solid rgba(56, 239, 125, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#38EF7D",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                SCENARIO 02 / 门店与创客
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>
                新店开业免布线，插电即营业
              </h3>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(56, 239, 125, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38EF7D",
              }}
            >
              <Store size={26} />
            </div>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}>
            收银系统、客用 Wi-Fi、安防监控多终端并发稳定，无需繁琐企业专线申请。
          </p>
        </div>

        {/* Card 3: 大平层与别墅盲区 */}
        <div
          style={{
            opacity: card3Spring,
            transform: `scale(${card3Spring}) translateY(${(1 - card3Spring) * 30}px)`,
            padding: "28px 32px",
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(25, 20, 40, 0.7) 0%, rgba(15, 12, 28, 0.85) 100%)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#C084FC",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                SCENARIO 03 / 盲区补强
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>
                光纤进不来的地方，它无缝补齐
              </h3>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(168, 85, 247, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C084FC",
              }}
            >
              <Building2 size={26} />
            </div>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}>
            地下影音室、阁楼阳台无弱电接口？摆上 5G 路由终端，免穿管打洞，满速畅通。
          </p>
        </div>

        {/* Card 4: 随行移动作业与展会 */}
        <div
          style={{
            opacity: card4Spring,
            transform: `scale(${card4Spring}) translateY(${(1 - card4Spring) * 30}px)`,
            padding: "28px 32px",
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(20, 30, 45, 0.7) 0%, rgba(12, 18, 25, 0.85) 100%)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#00F5FF",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                SCENARIO 04 / 临时展会与移动作业
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>
                插上电源，走到哪都是千兆光网
              </h3>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(0, 245, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00F5FF",
              }}
            >
              <MoveRight size={26} />
            </div>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}>
            展位布展、临时直播间或户外营地，接通 220V 或移动电站，全队瞬间拥有高速局域网。
          </p>
        </div>
      </div>
    </div>
  );
};
