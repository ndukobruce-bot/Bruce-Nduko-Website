import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
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
          justifyContent: "center",
          padding: "80px",
          background: "#0b0b0c",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9a9a9a",
            marginBottom: 28,
          }}
        >
          {profile.location}
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#f5f5f5",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            fontSize: 36,
            marginTop: 24,
            color: "#e6c65c",
          }}
        >
          {profile.headline}
        </div>
      </div>
    ),
    { ...size }
  );
}
