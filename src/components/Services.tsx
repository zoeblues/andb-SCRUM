// src/components/Services.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// ⚡️ NEW: Added Pencil and Trash icons for editing/deleting ⚡️
import { Button } from "./ui/button";
import { Plus, Clock, DollarSign, ListPlus, Users, Pencil, Trash } from "lucide-react";
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
    // ⚡️ NEW PROPS ⚡️
    onEditService: (service: Service) => void;
    onDeleteService: (serviceId: number) => void;
    staffMembers: StaffMember[]; // Prop to receive staff data
}

const INITIAL_CATEGORIES = [
    "Haircuts",
    "Color",
    "Nails",
    "Styling",
];

// Define a type for the Service form data, which is similar to Service but staffMemberId is a string for the Select component
type ServiceFormData = Omit<Service, 'id' | 'price' | 'staffMemberId'> & {
    id: number | null;
    price: number | string;
    staffMemberId: number | string; // Stored as string to work easily with the Select value prop
}

const INITIAL_SERVICE_FORM_DATA: ServiceFormData = {
    id: null,
    name: "",
    description: "",
    duration: "",
    price: 0,
    category: INITIAL_CATEGORIES[0] || "",
    staffMemberId: 0,
    staffMemberName: ""
};

export function Services({ services, onAddService, onEditService, onDeleteService, staffMembers }: ServicesProps) {
    // Dialog state for adding/editing a service
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

    // ⚡️ NEW: State to track if we are editing or adding ⚡️
    const [isEditing, setIsEditing] = useState(false);

    // Dialog state and input for creating a category
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // ⚡️ NEW: Dialog state for deleting a service ⚡️
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    // Dynamic state for categories (starting with defaults)
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    // ⚡️ Updated form data type and initial state ⚡️
    const [formData, setFormData] = useState<ServiceFormData>(INITIAL_SERVICE_FORM_DATA);

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName && !categories.includes(newCategoryName)) {
            setCategories([...categories, newCategoryName]);
            setNewCategoryName("");
            setIsCategoryDialogOpen(false);
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_SERVICE_FORM_DATA);
        setIsEditing(false);
    }

    const handleOpenAddDialog = () => {
        resetForm();
        setIsServiceDialogOpen(true);
    }

    // ⚡️ NEW: Function to populate form for editing ⚡️
    const handleOpenEditDialog = (service: Service) => {
        const staffIdString = service.staffMemberId ? service.staffMemberId.toString() : "0";
        setIsEditing(true);
        setFormData({
            ...service,
            id: service.id,
            price: service.price, // Keep as number for now, but ensure input handles it
            staffMemberId: staffIdString // Convert to string for Select component
        });
        setIsServiceDialogOpen(true);
    };

    // ⚡️ NEW: Function to open delete confirmation dialog ⚡️
    const handleOpenDeleteDialog = (service: Service) => {
        setServiceToDelete(service);
        setIsDeleteDialogOpen(true);
    };

    const handleServiceSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedStaff = staffMembers.find(s => s.id.toString() === formData.staffMemberId.toString());

        const servicePayload: Service = {
            id: formData.id as number, // ID is required for edit, though null for add, assertion is fine here
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            category: formData.category,
            // Convert staffMemberId back to number or null
            staffMemberId: selectedStaff ? selectedStaff.id : null,
            staffMemberName: selectedStaff ? selectedStaff.name : "Unassigned",
            price: parseFloat(formData.price.toString()), // Ensure price is a number
        };

        if (isEditing && formData.id) {
            onEditService(servicePayload);
        } else {
            // Remove the temporary null ID for POST request
            delete (servicePayload as any).id;
            onAddService(servicePayload);
        }

        // Reset and close
        resetForm();
        setIsServiceDialogOpen(false);
    };

    // ⚡️ NEW: Function to confirm and execute deletion ⚡️
    const handleConfirmDelete = () => {
        if (serviceToDelete) {
            onDeleteService(serviceToDelete.id);
            setIsDeleteDialogOpen(false);
            setServiceToDelete(null);
        }
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
                <Button onClick={handleOpenAddDialog}>
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
                                <div key={service.id} className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg">{service.name}</h4>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenEditDialog(service)}>
                                                <Pencil className="h-4 w-4 text-purple-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-100" onClick={() => handleOpenDeleteDialog(service)}>
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
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

            {/* Dialog for adding a new category (No changes needed) */}
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

            {/* Dialog for adding/editing a new service ⚡️ Updated Title/Description/Submit ⚡️ */}
            <Dialog open={isServiceDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    resetForm();
                }
                setIsServiceDialogOpen(open);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Service" : "Add New Service"}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? "Update the details for this salon service." : "Fill in the details for the new salon service."}
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
                                    onValueChange={(value) => setFormData({ ...formData, staffMemberId: value, staffMemberName: staffMembers.find(s => s.id.toString() === value)?.name || "Unassigned" })}
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
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{isEditing ? "Save Changes" : "Add Service"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ⚡️ NEW: Dialog for deleting a service ⚡️ */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the service:
                            <span className="font-bold text-red-600 ml-1">{serviceToDelete?.name}</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Delete Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}