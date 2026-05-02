import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Summer from "./pages/Summer.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ScrollManager = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    const id = hash ? decodeURIComponent(hash.slice(1)) : "";
    const scrollToTarget = () => {
      if (id) {
        document
          .getElementById(id)
          ?.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const frame = window.requestAnimationFrame(scrollToTarget);
    const timeouts = [150, 650, 1400].map((delay) =>
      window.setTimeout(scrollToTarget, delay),
    );

    return () => {
      window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [hash, pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        basename={import.meta.env.BASE_URL}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Summer />} />
          <Route path="/summer" element={<Summer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
