import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = "Krishna Teja — Backend Engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundColor: "#0a0a0b",
          color: "#f4f1ea",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 10,
            backgroundColor: "#f59e0b",
            marginBottom: 48,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Krishna Teja
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 44,
            color: "#a8a29e",
            marginTop: 20,
          }}
        >
          Backend Engineer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a8a29e",
            marginTop: 56,
          }}
        >
          Event-driven data platforms in Python on AWS.
        </div>
      </div>
    ),
    { ...size },
  );
}
