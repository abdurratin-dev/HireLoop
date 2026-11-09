import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSideber from "../components/dashboard-sideber";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSideber />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}