// App.tsx

import { useState, useEffect } from "react";
import { LayoutDashboard, Calendar, Users, UserCog, Scissors, Menu, X, BarChart } from "lucide-react";


// CRITICAL FIX: Ensure all imports start with './components/' from App.tsx (which is in src/)
import { Staff } from "./components/Staff";
import { Services } from "./components/Services";
import { Insights } from "./components/Insights";
import { Button } from "./components/ui/button";

const API_BASE_URL = "http://localhost:3001/api";

type TabType =  "staff" | "services" | "insights";

export default function App() {
    // INITIALIZE STATE: Read from the URL hash, default to 'insights'
    const initialTab = (window.location.hash.slice(1) || "services") as TabType;
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Initialize data arrays as empty
    const [appointments, setAppointments] = useState<any[]>([]);
    // const [clients, setClients] = useState<any[]>([]); // REMOVED
    const [staff, setStaff] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const setTabAndHash = (tab: TabType) => {
        setActiveTab(tab);
        window.location.hash = tab;
    };

    // 1. FETCH DATA ON INITIAL LOAD
    useEffect(() => {
        const fetchData = async (endpoint: string, setter: (data: any) => void) => {
            try {
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

        // Fetch required data sets from your running server
        fetchData('staff', setStaff);
        fetchData('services', setServices);
        // ⚡️ APPOINTMENTS FETCHING UNCOMMENTED ⚡️
        fetchData('appointments', setAppointments);
        // fetchData('clients', setClients); // REMOVED

        const handleHashChange = () => {
            const hashTab = window.location.hash.slice(1) as TabType;
            if (hashTab && navItems.some(item => item.id === hashTab)) {
                setActiveTab(hashTab);
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // 2. HANDLERS TO POST, PUT, DELETE DATA TO SERVER

    // STAFF HANDLERS
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

    // SERVICE HANDLERS
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

    const handleEditService = async (service: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/services/${service.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service),
            });
            if (response.ok) {
                const updatedService = await response.json();
                setServices(prevServices => prevServices.map(s => s.id === updatedService.id ? updatedService : s));
            }
        } catch (error) {
            console.error("Failed to edit service:", error);
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
                method: 'DELETE',
            });
            if (response.status === 204) {
                setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
            }
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };

    // Placeholder handlers (now only for appointments)
    const handleAddAppointment = (appointment: any) => {
        setAppointments(prevApts => [...prevApts, { id: Date.now(), ...appointment }]);
    };
    // handleAddClient removed

    const navItems = [
        { id: "services" as TabType, label: "Services", icon: Scissors },
        { id: "staff" as TabType, label: "Staff", icon: UserCog },
        { id: "insights" as TabType, label: "Analytics", icon: BarChart }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header (omitted for brevity) */}
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
                {/* Sidebar (omitted for brevity) */}
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
                                        setTabAndHash(item.id);
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

                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {activeTab === "services" && (
                        <Services
                            services={services}
                            onAddService={handleAddService}
                            onEditService={handleEditService}
                            onDeleteService={handleDeleteService}
                            staffMembers={staff}
                        />
                    )}
                    {activeTab === "staff" && (
                        <Staff staff={staff} onAddStaff={handleAddStaff} />
                    )}
                    {activeTab === "insights" && (
                        // ⚡️ PASS REQUIRED DATA TO INSIGHTS ⚡️
                        <Insights appointments={appointments} services={services} />
                    )}

                </main>
            </div>
        </div>
    );
}