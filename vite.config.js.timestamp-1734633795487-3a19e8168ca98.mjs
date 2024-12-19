// vite.config.js
import { defineConfig } from "file:///C:/Users/tmayfield.LSRVNA/Documents/GitHub/Focus-Free-Refresh/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/tmayfield.LSRVNA/Documents/GitHub/Focus-Free-Refresh/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///C:/Users/tmayfield.LSRVNA/Documents/GitHub/Focus-Free-Refresh/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Focus Free Refresh",
  version: "1.0.0",
  description: "Automatically refresh your tabs at custom intervals",
  permissions: ["storage", "tabs", "activeTab"],
  action: {
    default_popup: "popup.html"
  },
  options_page: "options.html",
  background: {
    service_worker: "background.js",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["content.js"]
    }
  ],
  icons: {
    "16": "icon.png",
    "32": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  }
};

// vite.config.js
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default })],
  build: {
    emptyOutDir: true,
    outDir: "dist",
    modulePreload: false,
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: {
        popup: "src/popup/index.html",
        options: "src/options/index.html",
        background: "src/background/background.js",
        content: "src/content/content.js"
      },
      output: {
        format: "es",
        dir: "dist",
        chunkFileNames: "[name].[hash].js",
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]"
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHRtYXlmaWVsZC5MU1JWTkFcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxGb2N1cy1GcmVlLVJlZnJlc2hcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHRtYXlmaWVsZC5MU1JWTkFcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxGb2N1cy1GcmVlLVJlZnJlc2hcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3RtYXlmaWVsZC5MU1JWTkEvRG9jdW1lbnRzL0dpdEh1Yi9Gb2N1cy1GcmVlLVJlZnJlc2gvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgY3J4IH0gZnJvbSBcIkBjcnhqcy92aXRlLXBsdWdpblwiO1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0Lmpzb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcbiAgYnVpbGQ6IHtcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgIG1vZHVsZVByZWxvYWQ6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogXCJzcmMvcG9wdXAvaW5kZXguaHRtbFwiLFxuICAgICAgICBvcHRpb25zOiBcInNyYy9vcHRpb25zL2luZGV4Lmh0bWxcIixcbiAgICAgICAgYmFja2dyb3VuZDogXCJzcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLmpzXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwic3JjL2NvbnRlbnQvY29udGVudC5qc1wiLFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBmb3JtYXQ6IFwiZXNcIixcbiAgICAgICAgZGlyOiBcImRpc3RcIixcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiW25hbWVdLltoYXNoXS5qc1wiLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJbbmFtZV0uanNcIixcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiYXNzZXRzL1tuYW1lXS5bZXh0XVwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBcIi9zcmNcIixcbiAgICB9LFxuICB9LFxufSk7XG4iLCAie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJuYW1lXCI6IFwiRm9jdXMgRnJlZSBSZWZyZXNoXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJBdXRvbWF0aWNhbGx5IHJlZnJlc2ggeW91ciB0YWJzIGF0IGN1c3RvbSBpbnRlcnZhbHNcIixcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXCJzdG9yYWdlXCIsIFwidGFic1wiLCBcImFjdGl2ZVRhYlwiXSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInBvcHVwLmh0bWxcIlxuICB9LFxuICBcIm9wdGlvbnNfcGFnZVwiOiBcIm9wdGlvbnMuaHRtbFwiLFxuICBcImJhY2tncm91bmRcIjoge1xuICAgIFwic2VydmljZV93b3JrZXJcIjogXCJiYWNrZ3JvdW5kLmpzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbiAgfSxcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xuICAgIHtcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCI8YWxsX3VybHM+XCJdLFxuICAgICAgXCJqc1wiOiBbXCJjb250ZW50LmpzXCJdXG4gICAgfVxuICBdLFxuICBcImljb25zXCI6IHtcbiAgICBcIjE2XCI6IFwiaWNvbi5wbmdcIixcbiAgICBcIjMyXCI6IFwiaWNvbi5wbmdcIixcbiAgICBcIjQ4XCI6IFwiaWNvbi5wbmdcIixcbiAgICBcIjEyOFwiOiBcImljb24ucG5nXCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxWCxTQUFTLG9CQUFvQjtBQUNsWixPQUFPLFdBQVc7QUFDbEIsU0FBUyxXQUFXOzs7QUNGcEI7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLGFBQWUsQ0FBQyxXQUFXLFFBQVEsV0FBVztBQUFBLEVBQzlDLFFBQVU7QUFBQSxJQUNSLGVBQWlCO0FBQUEsRUFDbkI7QUFBQSxFQUNBLGNBQWdCO0FBQUEsRUFDaEIsWUFBYztBQUFBLElBQ1osZ0JBQWtCO0FBQUEsSUFDbEIsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxTQUFXLENBQUMsWUFBWTtBQUFBLE1BQ3hCLElBQU0sQ0FBQyxZQUFZO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUNGOzs7QURyQkEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsMkJBQVMsQ0FBQyxDQUFDO0FBQUEsRUFDcEMsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsWUFBWTtBQUFBLFFBQ1osU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLEtBQUs7QUFBQSxRQUNMLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
