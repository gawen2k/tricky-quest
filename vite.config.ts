import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// 웹 우선 PWA. 정적 호스팅(루트) 기준. 서브경로 배포 시 base 조정.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "game001",
        short_name: "game001",
        description: "머리를 쓰는 찾기·퍼즐 게임 (가제)",
        theme_color: "#0f1226",
        background_color: "#0f1226",
        display: "standalone",
        orientation: "portrait",
        start_url: "./",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
