import React from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

export function ServiceCategorizer() {
    
    const [selectedServices, setSelectedServices] = React.useState<number[]>([]);
    const [targetCategory, setTargetCategory] = React.useState<string | null>(null);

    const handleApply = () => {
        if (selectedServices.length > 0 && targetCategory) {
            console.log(`[CATEGORIZER] Applying category "${targetCategory}" to ${selectedServices.length} services.`);
            alert(`Bulk update successful (not really)!`);
        } else {
            alert("Select services and a category first.");
        }
    }

    const toggleService = (id: number) => {
        setSelectedServices(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    }

    const fakeServices = [{ id: 10, name: "Kids Cut" }, { id: 11, name: "Deep Conditioning" }, { id: 12, name: "Acrylic Fill" }];
    const fakeCategories = ["Haircuts", "Treatment", "Nails"];

    return (
        <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold">Bulk Service Categorization</h3>
            
            <div className="space-y-2">
                <Label>Select Services to Categorize:</Label>
                {fakeServices.map(service => (
                    <div key={service.id} className="flex items-center space-x-2 border-b p-2 bg-white rounded-md">
                        <Checkbox 
                            id={`service-${service.id}`} 
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => toggleService(service.id)}
                        />
                        <label htmlFor={`service-${service.id}`} className="text-sm font-medium leading-none">
                            {service.name}
                        </label>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category-select">Assign to Category</Label>
                <Select onValueChange={setTargetCategory} value={targetCategory || ""}>
                    <SelectTrigger id="category-select">
                        <SelectValue placeholder="Select Target Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {fakeCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <Button onClick={handleApply} disabled={selectedServices.length === 0 || !targetCategory} className="w-full">
                Apply Category to {selectedServices.length} Services
            </Button>
        </div>
    );
}