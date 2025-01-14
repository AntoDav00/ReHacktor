import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_RAWG_API_KEY': JSON.stringify(process.env.VITE_RAWG_API_KEY)
  }
});
