import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthGuard } from "@/components/AuthGuard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Training from "./pages/Training";
import Policies from "./pages/Policies";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <AuthGuard>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 flex items-center border-b px-4 lg:px-6">
                      <SidebarTrigger />
                      <div className="ml-auto">
                        <h2 className="text-lg font-semibold">Evergreen Training Portal</h2>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthGuard>
          } />
          <Route path="/training" element={
            <AuthGuard>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 flex items-center border-b px-4 lg:px-6">
                      <SidebarTrigger />
                      <div className="ml-auto">
                        <h2 className="text-lg font-semibold">Evergreen Training Portal</h2>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Training />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthGuard>
          } />
          <Route path="/policies" element={
            <AuthGuard>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 flex items-center border-b px-4 lg:px-6">
                      <SidebarTrigger />
                      <div className="ml-auto">
                        <h2 className="text-lg font-semibold">Evergreen Training Portal</h2>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Policies />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthGuard>
          } />
          <Route path="/compliance" element={
            <AuthGuard requiredRole={['manager', 'admin']}>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 flex items-center border-b px-4 lg:px-6">
                      <SidebarTrigger />
                      <div className="ml-auto">
                        <h2 className="text-lg font-semibold">Evergreen Training Portal</h2>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Compliance />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthGuard>
          } />
          <Route path="/reports" element={
            <AuthGuard requiredRole={['manager', 'admin']}>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 flex items-center border-b px-4 lg:px-6">
                      <SidebarTrigger />
                      <div className="ml-auto">
                        <h2 className="text-lg font-semibold">Evergreen Training Portal</h2>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Reports />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthGuard>
          } />
          <Route path="/admin" element={
            <AuthGuard requiredRole={['admin']}>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 flex items-center border-b px-4 lg:px-6">
                      <SidebarTrigger />
                      <div className="ml-auto">
                        <h2 className="text-lg font-semibold">Evergreen Training Portal</h2>
                      </div>
                    </header>
                    <main className="flex-1 overflow-auto">
                      <Admin />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </AuthGuard>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
