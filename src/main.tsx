import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Reshaped } from "reshaped";
import "reshaped/themes/slate/theme.css";
import "@fontsource-variable/geist";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Reshaped theme="slate">
        <App />
      </Reshaped>
    </QueryClientProvider>
  </StrictMode>,
);