import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://gamify-deploy.onrender.com",
        changeOrigin: true,
        secure: true, // Change to true for HTTPS
      },
      "/socket.io": {
        target: "https://gamify-deploy.onrender.com",
        ws: true,
        changeOrigin: true,
        secure: true, // Change to true for HTTPS
        // cookieDomainRewrite: "localhost",
      },
    },
  },
});
