import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f7fb]">
      
      {/* Sidebar */}
      <aside className="w-[260px] fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1">
        {children}
      </main>

    </div>
  );
}