import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Transactions from "./pages/Transactions";
import SchoolTransactions from "./pages/SchoolTransactions";
import StatusCheck from "./pages/StatusCheck";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import NotAuthenticated from "./pages/NotAuthenticated";
import { MainLayout } from "./components/layout/main-layout";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

// Auth guard for protected routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  
  if (!isAuthenticated) {
    return <Navigate to="/not-authenticated" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/not-authenticated" element={<NotAuthenticated />} />
            
            {/* Protected routes */}
            <Route 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Navigate to="/transactions" replace />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/by-school" element={<SchoolTransactions />} />
              <Route path="/status-check" element={<StatusCheck />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
