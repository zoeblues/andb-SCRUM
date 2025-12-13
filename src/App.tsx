import { useState } from "react";
import { LayoutDashboard, Calendar, Users, UserCog, Scissors, Menu, X } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Staff } from "./components/Staff";
import { Services } from "./components/Services";
import { Button } from "./components/ui/button";

// Mock data
const initialAppointments = [
    {
        id: 1,
        clientName: "Sarah Johnson",
        service: "Hair Color & Highlights",
        stylist: "Emily Davis",
        date: "2025-11-08",
        time: "10:00",
        duration: "2 hours",
        price: 180,
        status: "confirmed"
    },
    {
        id: 2,
        clientName: "Michael Chen",
        service: "Men's Haircut",
        stylist: "James Wilson",
        date: "2025-11-08",
        time: "11:30",
        duration: "45 min",
        price: 45,
        status: "confirmed"
    },
    {
        id: 3,
        clientName: "Lisa Anderson",
        service: "Balayage Treatment",
        stylist: "Emily Davis",
        date: "2025-11-08",
        time: "14:00",
        duration: "3 hours",
        price: 250,
        status: "pending"
    },
    {
        id: 4,
        clientName: "David Martinez",
        service: "Beard Trim & Styling",
        stylist: "James Wilson",
        date: "2025-11-09",
        time: "09:00",
        duration: "30 min",
        price: 30,
        status: "confirmed"
    },
    {
        id: 5,
        clientName: "Emma Thompson",
        service: "Keratin Treatment",
        stylist: "Sophia Rodriguez",
        date: "2025-11-09",
        time: "13:00",
        duration: "2.5 hours",
        price: 200,
        status: "confirmed"
    }
];

const initialClients = [
    {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(555) 123-4567",
        lastVisit: "2025-11-08",
        totalVisits: 12,
        totalSpent: 1850,
        notes: "Prefers Emily as stylist"
    },
    {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@email.com",
        phone: "(555) 234-5678",
        lastVisit: "2025-11-08",
        totalVisits: 8,
        totalSpent: 360,
        notes: ""
    },
    {
        id: 3,
        name: "Lisa Anderson",
        email: "lisa.a@email.com",
        phone: "(555) 345-6789",
        lastVisit: "2025-10-25",
        totalVisits: 15,
        totalSpent: 2400,
        notes: "Allergic to certain hair products"
    },
    {
        id: 4,
        name: "David Martinez",
        email: "d.martinez@email.com",
        phone: "(555) 456-7890",
        lastVisit: "2025-10-30",
        totalVisits: 6,
        totalSpent: 180,
        notes: ""
    },
    {
        id: 5,
        name: "Emma Thompson",
        email: "emma.t@email.com",
        phone: "(555) 567-8901",
        lastVisit: "2025-11-02",
        totalVisits: 10,
        totalSpent: 1500,
        notes: "VIP client"
    }
];

const initialStaff = [
    {
        id: 1,
        name: "Emily Davis",
        email: "emily.d@salon.com",
        phone: "(555) 111-2222",
        specialties: ["Color", "Highlights", "Balayage"],
        status: "active",
        rating: 4.9,
        completedServices: 234
    },
    {
        id: 2,
        name: "James Wilson",
        email: "james.w@salon.com",
        phone: "(555) 222-3333",
        specialties: ["Men's Cut", "Beard Styling", "Fade"],
        status: "active",
        rating: 4.8,
        completedServices: 189
    },
    {
        id: 3,
        name: "Sophia Rodriguez",
        email: "sophia.r@salon.com",
        phone: "(555) 333-4444",
        specialties: ["Keratin", "Hair Treatments", "Styling"],
        status: "active",
        rating: 5.0,
        completedServices: 156
    },
    {
        id: 4,
        name: "Oliver Martinez",
        email: "oliver.m@salon.com",
        phone: "(555) 444-5555",
        specialties: ["Haircut", "Color", "Extensions"],
        status: "active",
        rating: 4.7,
        completedServices: 142
    }
];

const initialServices = [
    {
        id: 1,
        name: "Women's Haircut",
        category: "Haircuts",
        description: "Professional haircut with wash and style",
        duration: "60 min",
        price: 65,
        staffMemberId: 1, // Example initial assignment
        staffMemberName: "Emily Davis"
    },
    {
        id: 2,
        name: "Men's Haircut",
        category: "Haircuts",
        description: "Classic or modern men's cut",
        duration: "45 min",
        price: 45,
        staffMemberId: 2,
        staffMemberName: "James Wilson"
    },
    {
        id: 3,
        name: "Hair Color & Highlights",
        category: "Color Services",
        description: "Full color or highlight service",
        duration: "2 hours",
        price: 180,
        staffMemberId: 1,
        staffMemberName: "Emily Davis"
    },
    {
        id: 4,
        name: "Balayage Treatment",
        category: "Color Services",
        description: "Hand-painted highlights for natural look",
        duration: "3 hours",
        price: 250,
        staffMemberId: 3,
        staffMemberName: "Sophia Rodriguez"
    },
    {
        id: 5,
        name: "Keratin Treatment",
        category: "Treatments",
        description: "Smoothing and strengthening treatment",
        duration: "2.5 hours",
        price: 200,
        staffMemberId: 3,
        staffMemberName: "Sophia Rodriguez"
    },
    {
        id: 6,
        name: "Deep Conditioning",
        category: "Treatments",
        description: "Intensive moisture treatment",
        duration: "45 min",
        price: 50,
        staffMemberId: null,
        staffMemberName: "Unassigned"
    },
    {
        id: 7,
        name: "Blowout & Styling",
        category: "Styling",
        description: "Professional blow dry and style",
        duration: "45 min",
        price: 55,
        staffMemberId: 1,
        staffMemberName: "Emily Davis"
    },
    {
        id: 8,
        name: "Beard Trim & Styling",
        category: "Men's Services",
        description: "Beard shaping and grooming",
        duration: "30 min",
        price: 30,
        staffMemberId: 2,
        staffMemberName: "James Wilson"
    }
];

type TabType = "dashboard" | "appointments" | "clients" | "staff" | "services";

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");
    const [appointments, setAppointments] = useState(initialAppointments);
    const [clients, setClients] = useState(initialClients);
    const [staff, setStaff] = useState(initialStaff);
    const [services, setServices] = useState(initialServices);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleAddAppointment = (appointment: any) => {
        setAppointments([...appointments, appointment]);
    };

    const handleAddClient = (client: any) => {
        setClients([...clients, client]);
    };

    const handleAddStaff = (member: any) => {
        setStaff([...staff, member]);
    };

    const handleAddService = (service: any) => {
        setServices([...services, service]);
    };

    const navItems = [
        { id: "dashboard" as TabType, label: "Insights", icon: LayoutDashboard },
        //{ id: "appointments" as TabType, label: "Appointments", icon: Calendar },
        //{ id: "clients" as TabType, label: "Clients", icon: Users },
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
                            staffMembers={staff} // <-- Staff data is correctly passed here
                        />
                    )}
                </main>
            </div>
        </div>
    );
}