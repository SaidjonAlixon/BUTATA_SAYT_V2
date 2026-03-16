import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Drivers from "@/pages/Drivers";
import Contact from "@/pages/Contact";
import Apply from "@/pages/Apply";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ApplicationsPage from "@/pages/admin/ApplicationsPage";
import JobsPage from "@/pages/admin/JobsPage";
import ContactsPage from "@/pages/admin/ContactsPage";
import NewsPage from "@/pages/admin/NewsPage";
import NotFound from "@/pages/not-found";
import ScrollToTop from "@/components/ScrollToTop";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/drivers" component={Drivers} />
      <Route path="/contact" component={Contact} />
      <Route path="/apply" component={Apply} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/applications" component={ApplicationsPage} />
      <Route path="/admin/jobs" component={JobsPage} />
      <Route path="/admin/contacts" component={ContactsPage} />
      <Route path="/admin/news" component={NewsPage} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="butata-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
