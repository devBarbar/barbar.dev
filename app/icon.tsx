import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#020617",
        border: "2px solid #2563eb",
        borderRadius: 10,
        color: "white",
        display: "flex",
        fontSize: 27,
        fontWeight: 800,
        height: "100%",
        justifyContent: "center",
        letterSpacing: "-2px",
        width: "100%",
      }}
    >
      b<span style={{ color: "#60a5fa" }}>.</span>
    </div>,
    size,
  );
}
