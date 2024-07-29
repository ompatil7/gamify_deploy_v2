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

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     //got rid of the CORS error
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false, //as http not https
//       },
//     },
//   },
// });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     proxy: {
//       "/api": {
//         target: "https://gamifybeta-1.onrender.com",
//         changeOrigin: true,
//         secure: false,
//         cookieDomainRewrite: "localhost",
//       },
//       "/socket.io": {
//         target: "https://gamifybeta-1.onrender.com",
//         ws: true,
//         changeOrigin: true,
//         secure: false,
//         cookieDomainRewrite: "localhost",
//       },
//     },
//   },
// });
