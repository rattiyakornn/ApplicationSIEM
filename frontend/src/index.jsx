import { useState } from "react";

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [monitoringOpen, setMonitoringOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    {
      id: "monitoring",
      label: "Monitoring",
      submenu: [
        { id: "overview", label: "Overview" },
        { id: "webtraffic", label: "WebTraffic" },
      ],
    },
    { id: "incidents", label: "Incidents" },
    { id: "logexplorer", label: "LogExplorer" },
  ];

  // ฟังก์ชันจัดการคลิกเมนูหลัก
  const handleMenuClick = (id, hasSubmenu) => {
    if (hasSubmenu) {
      setMonitoringOpen(!monitoringOpen); 
    } else {
      setActiveMenu(id);
      setMonitoringOpen(false); 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-gray-800 transition-all duration-300 flex flex-col shadow-2xl border-r border-gray-700`}
      >
        {/* Logo and toggle */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </div>
            {!sidebarCollapsed && (
              <h2 className="text-xl font-bold">Analysis & Logs</h2>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {/* เมนู Monitoring */}
            <li>
              <button
                onClick={() => setMonitoringOpen(!monitoringOpen)}
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activeMenu === "monitoring"
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title={sidebarCollapsed ? "Monitoring" : ""}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium">Monitoring</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      monitoringOpen ? "rotate-90" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>

              {/* Dropdown submenu */}
              {monitoringOpen && !sidebarCollapsed && (
                <ul className="pl-8 mt-1 space-y-1">
                  <li>
                    <button
                      className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                        activeMenu === "overview"
                          ? "bg-green-600 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                      
                      onClick={() => setActiveMenu("overview")}
                      
                    >
                      Overview
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                        activeMenu === "webtraffic"
                          ? "bg-green-600 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setActiveMenu("webtraffic")}
                    >
                      WebTraffic
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* เมนูอื่นๆ */}
            {menuItems
              .filter((item) => item.id !== "monitoring")
              .map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      activeMenu === item.id
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    title={sidebarCollapsed ? item.label : ""}
                  >
                    {/* Placeholder for icon */}
                    <span className="text-xl">📊</span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        {/* User Profile */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-medium">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">Admin User</p>
                <p className="truncate text-gray-400 text-xs">
                  admin@example.com
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Button */}
      <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors flex items-center justify-center"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

      </aside>

      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-gray-800 shadow-lg border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold capitalize">{activeMenu}</h1>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <p className="text-gray-300">
            นี่คือหน้าหลักสำหรับเมนู: <strong>{activeMenu}</strong>
          </p>
          {/* ใส่เนื้อหาเพิ่มเติมตรงนี้ */}
        </main>
      </div>
    </div>
  );
}
