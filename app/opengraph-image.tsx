import { ImageResponse } from "next/og";

export const alt = "HomeGuide IQ San Diego outdoor project cost guides";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7faf7",
          color: "#1a1a1a",
          padding: "64px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <span>HomeGuide IQ</span>
          <span style={{ color: "#27ae60" }}>San Diego</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: 0,
              maxWidth: 920,
            }}
          >
            Outdoor project costs without the guesswork
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "#435044",
              maxWidth: 860,
            }}
          >
            Pavers, turf, concrete patios, pergolas, retaining walls, outdoor
            kitchens, and backyard remodels priced for San Diego homeowners.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 24,
            color: "#1f5f37",
            fontWeight: 700,
          }}
        >
          <span>Local cost ranges</span>
          <span>|</span>
          <span>Contractor-informed estimates</span>
          <span>|</span>
          <span>Free partner handoff</span>
        </div>
      </div>
    ),
    size,
  );
}
