import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from 'sonner';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
