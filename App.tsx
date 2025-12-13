import { useState, useEffect } from "react";
import { LayoutDashboard, Calendar, Users, UserCog, Scissors, Menu, X } from "lucide-react";

// ⚡️ CRITICAL FIX: Ensure all imports start with './components/' from App.tsx (which is in src/)
import { Dashboard } from "./components/Dashboard";
import { Staff } from "./components/Staff";
import { Services } from "./components/Services";
import { Button } from "./components/ui/button"; // Path for UI components

const API_BASE_URL = "http://localhost:3001/api";

type TabType = "dashboard" | "appointments" | "clients" | "staff" | "services";

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");

    // Initialize data arrays as empty
    const [appointments, setAppointments] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 1. FETCH DATA ON INITIAL LOAD
    useEffect(() => {
        const fetchData = async (endpoint: string, setter: (data: any) => void) => {
            try {
                // Ensure the fetch URL is correct
                const response = await fetch(`${API_BASE_URL}/${endpoint}`);
                if (response.ok) {
                    const data = await response.json();
                    setter(data);
                    console.log(`Successfully loaded ${endpoint} data.`);
                } else {
                    console.error(`Failed to fetch ${endpoint}:`, response.statusText);
                }
            } catch (error) {
                console.error(`Error fetching ${endpoint}. Is the server on port 3001 running?`, error);
            }
        };

        // Fetch all four data sets from your running server
        fetchData('staff', setStaff);
        fetchData('services', setServices);
        fetchData('appointments', setAppointments);
        fetchData('clients', setClients);
    }, []);

    // 2. HANDLERS TO POST DATA TO SERVER
    const handleAddStaff = async (member: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(member),
            });
            if (response.ok) {
                const newMember = await response.json();
                setStaff(prevStaff => [...prevStaff, newMember]);
            }
        } catch (error) {
            console.error("Failed to add staff member:", error);
        }
    };

    const handleAddService = async (service: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service),
            });
            if (response.ok) {
                const newService = await response.json();
                setServices(prevServices => [...prevServices, newService]);
            }
        } catch (error) {
            console.error("Failed to add service:", error);
        }
    };

    // Placeholder handlers
    const handleAddAppointment = (appointment: any) => {
        setAppointments(prevApts => [...prevApts, { id: Date.now(), ...appointment }]);
    };

    const handleAddClient = (client: any) => {
        setClients(prevClients => [...prevClients, { id: Date.now(), ...client }]);
    };

    const navItems = [
        { id: "dashboard" as TabType, label: "Insights", icon: LayoutDashboard },
        { id: "staff" as TabType, label: "Staff", icon: UserCog },
        { id: "services" as TabType, label: "Services", icon: Scissors }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Scissors className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl">Glamour Salon</h1>
                                <p className="text-sm text-gray-600">Management System</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:sticky top-[73px] lg:top-[73px] left-0 z-30
          w-64 h-[calc(100vh-73px)] bg-white border-r
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activeTab === item.id
                                            ? "bg-purple-50 text-purple-700"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {activeTab === "dashboard" && (
                        <Dashboard appointments={appointments} clients={clients} staff={staff} />
                    )}
                    {activeTab === "staff" && (
                        <Staff staff={staff} onAddStaff={handleAddStaff} />
                    )}
                    {activeTab === "services" && (
                        <Services
                            services={services}
                            onAddService={handleAddService}
                            staffMembers={staff}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}