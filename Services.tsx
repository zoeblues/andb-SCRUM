// src/components/Services.tsx
import React, { useState } from "react"; // <-- FIX: Added React import
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


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
    "Color",
    "Nails",
    "Styling",
];

export function Services({ services, onAddService, staffMembers }: ServicesProps) {
    // Dialog state for adding a service
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

    // Dialog state and input for creating a category
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // Dynamic state for categories (starting with defaults)
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: "",
        price: 0,
        category: INITIAL_CATEGORIES[0] || "",
        staffMemberId: 0,
        staffMemberName: ""
    });

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName && !categories.includes(newCategoryName)) {
            setCategories([...categories, newCategoryName]);
            setNewCategoryName("");
            setIsCategoryDialogOpen(false);
        }
    };

    const handleServiceSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedStaff = staffMembers.find(s => s.id.toString() === formData.staffMemberId.toString());

        onAddService({
            ...formData,
            // Convert staffMemberId back to number
            staffMemberId: selectedStaff ? selectedStaff.id : null,
            staffMemberName: selectedStaff ? selectedStaff.name : "Unassigned",
            price: parseFloat(formData.price.toString()), // Ensure price is a number
        });

        // Reset form
        setFormData({
            name: "",
            description: "",
            duration: "",
            price: 0,
            category: categories[0] || "",
            staffMemberId: 0,
            staffMemberName: ""
        });
        setIsServiceDialogOpen(false);
    };

    const groupedServices = services.reduce((acc, service) => {
        const category = service.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    return (
        <div className="space-y-6">
            <div>
                <h2>Services Management</h2>
                <p className="text-gray-600">Define and manage all services offered at the salon.</p>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
                    <ListPlus className="h-4 w-4 mr-2" /> Add Category
                </Button>
                <Button onClick={() => setIsServiceDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Service
                </Button>
            </div>

            {Object.keys(groupedServices).map((category) => (
                <Card key={category}>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{category} ({groupedServices[category].length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedServices[category].map((service) => (
                                <div key={service.id} className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-lg">{service.name}</h4>
                                    <p className="text-gray-600 text-sm mb-2">{service.description || "No description provided."}</p>
                                    <div className="flex justify-between text-sm mt-2">
                                        <div className="flex items-center text-purple-600">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {service.duration}
                                        </div>
                                        <div className="flex items-center text-green-600">
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            ${service.price.toFixed(2)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Primary Staff: {service.staffMemberName || "Unassigned"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Dialog for adding a new category */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                            Define a new service category for grouping services.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                                id="categoryName"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="e.g., Pedicures, Facials"
                                required
                            />
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

            {/* Dialog for adding a new service */}
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new salon service.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Full Highlights"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="A brief description of the service."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="staff">Primary Staff</Label>
                                <Select
                                    value={formData.staffMemberId.toString()}
                                    onValueChange={(value) => setFormData({ ...formData, staffMemberId: parseInt(value), staffMemberName: staffMembers.find(s => s.id.toString() === value)?.name || "" })}
                                >
                                    <SelectTrigger id="staff">
                                        <SelectValue placeholder="Assign Staff" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staffMembers.map(staff => (
                                            <SelectItem key={staff.id} value={staff.id.toString()}>{staff.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
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