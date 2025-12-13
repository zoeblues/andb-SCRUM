import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Clock, DollarSign, ListPlus, Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Define internal interfaces for clarity
interface StaffMember {
    id: number;
    name: string;
}

interface Service {
    id: number;
    name: string;
    description: string;
    duration: string;
    price: number;
    category: string;
    staffMemberId: number | null;
    staffMemberName: string;
}

interface ServicesProps {
    services: Service[];
    onAddService: (service: any) => void;
    staffMembers: StaffMember[]; // Prop to receive staff data
}

const INITIAL_CATEGORIES = [
    "Haircuts",
    "Nails",
    "Styling",
];

export function Services({ services, onAddService, staffMembers }: ServicesProps) {
    // Dialog state for adding a service
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

    // Dialog state and input for creating a category
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // Dynamic state for categories, initialized with mock data and existing services
    const [availableCategories, setAvailableCategories] = useState<string[]>(() =>
        [...new Set([...INITIAL_CATEGORIES, ...services.map(s => s.category)])]
    );

    // Find the default staff ID (use the first member or an empty string)
    const defaultStaffId = staffMembers.length > 0 ? staffMembers[0].id.toString() : "";

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: "",
        price: "",
        category: availableCategories[0] || "",
        staffMemberId: defaultStaffId
    });

    // Handler for adding a new service
    const handleSubmitService = (e: React.FormEvent) => {
        e.preventDefault();

        // Find staff member details from the ID in formData
        const staffMember = staffMembers.find(s => s.id.toString() === formData.staffMemberId);

        onAddService({
            id: Date.now(),
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            price: parseFloat(formData.price),
            category: formData.category,
            staffMemberId: staffMember ? staffMember.id : null,
            staffMemberName: staffMember ? staffMember.name : "Unassigned"
        });

        // Reset form data
        setFormData({
            name: "",
            description: "",
            duration: "",
            price: "",
            category: availableCategories[0] || "",
            staffMemberId: defaultStaffId
        });
        setIsServiceDialogOpen(false);
    };

    // Handler for creating a new category using the dedicated Dialog form
    const handleSubmitCategory = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newCategoryName.trim();

        if (trimmedName && !availableCategories.includes(trimmedName)) {
            // Add the new category
            setAvailableCategories(prev => [...prev, trimmedName]);

            // Set the new category as the selected one in the Service form
            setFormData(prev => ({ ...prev, category: trimmedName }));

            // Clear category form and close dialog
            setNewCategoryName("");
            setIsCategoryDialogOpen(false);
        } else if (availableCategories.includes(trimmedName)) {
            alert(`Category "${trimmedName}" already exists.`);
        }
    };


    const categories = [...new Set(services.map(s => s.category))];


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2>Services</h2>
                    <p className="text-gray-600">Manage your salon services and pricing</p>
                </div>

                {/* Buttons for Service and Category Management */}
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
                        <ListPlus className="h-4 w-4 mr-2" />
                        Create Category
                    </Button>
                    <Button onClick={() => setIsServiceDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                    </Button>
                </div>
            </div>

            {/* --- Service Cards Display --- */}
            {categories.map((category) => (
                <div key={category} className="space-y-4">
                    <h3 className="text-lg text-gray-700">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services
                            .filter(service => service.category === category)
                            .map((service) => (
                                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                        {/* Display staff member name */}
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Users className="h-4 w-4 text-purple-600" />
                                            <span>{service.staffMemberName || "Unassigned"}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span>{service.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                <span className="text-lg">{service.price}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}

            {/* 1. Dedicated Dialog for Creating a Category */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                            Define a new category to group your salon services.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCategory}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-category-name">Category Name</Label>
                                <Input
                                    id="new-category-name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g., Facials, Hair Extensions"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Category</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


            {/* 2. Main Dialog for Adding a Service */}
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                            Create a new service offering for your salon.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitService}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="service-name">Service Name</Label>
                                <Input
                                    id="service-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Staff Member Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="staff-member">Assign Staff Member</Label>
                                <select
                                    id="staff-member"
                                    value={formData.staffMemberId}
                                    onChange={(e) => setFormData({ ...formData, staffMemberId: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">Unassigned</option>
                                    {staffMembers.map((staff) => (
                                        <option key={staff.id} value={staff.id.toString()}>
                                            {staff.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Simplified Category Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    {availableCategories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g., 60 min, 1.5 hours"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Add Service</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}