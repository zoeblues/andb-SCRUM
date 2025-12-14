// src/components/Staff.tsx
import React, { useState } from "react"; // <-- FIX: Added React import
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Mail, Phone, Award } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface StaffProps {
  staff: any[];
  onAddStaff: (staff: any) => void;
}

export function Staff({ staff, onAddStaff }: StaffProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialties: "",
    status: "active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStaff({
      // We no longer manually assign ID, the server handles it
      ...formData,
      specialties: formData.specialties.split(',').map(s => s.trim()),
      rating: 5.0, // Default for new staff
      completedServices: 0 // Default for new staff
    });
    setFormData({ name: "", email: "", phone: "", specialties: "", status: "active" });
    setIsDialogOpen(false);
  };

  const activeStaff = staff.filter(s => s.status === 'active');
  const inactiveStaff = staff.filter(s => s.status === 'inactive');

  return (
      <div className="space-y-6">
        <div>
          <h2>Staff Directory</h2>
          <p className="text-gray-600">Manage your salon professionals and their details.</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Staff Member
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Staff ({activeStaff.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeStaff.length === 0 ? (
                    <p className="text-gray-500">No active staff found. Add a new member!</p>
                ) : (
                    activeStaff.map((member) => (
                        <div key={member.id} className="border p-4 rounded-lg bg-purple-50 shadow-sm">
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          <p className="text-sm text-purple-700 font-medium mb-2">{member.specialties.join(' | ')}</p>
                          <div className="flex items-center text-sm text-gray-700">
                            <Mail className="h-4 w-4 mr-2" /> {member.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-700 mt-1">
                            <Phone className="h-4 w-4 mr-2" /> {member.phone}
                          </div>
                          <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t">
                            <div className="flex items-center text-amber-600">
                              <Award className="h-4 w-4 mr-1" /> Rating: {member.rating.toFixed(1)}
                            </div>
                            <p className="text-xs text-gray-500">Completed Services: {member.completedServices}</p>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inactive Staff ({inactiveStaff.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inactiveStaff.length === 0 ? (
                    <p className="text-gray-500">No inactive staff members.</p>
                ) : (
                    inactiveStaff.map((member) => (
                        <div key={member.id} className="border p-4 rounded-lg bg-gray-100 opacity-75 shadow-sm">
                          <h3 className="font-bold text-lg text-gray-600">{member.name} (Inactive)</h3>
                          <p className="text-sm text-gray-500 mb-2">{member.specialties.join(' | ')}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" /> {member.email}
                          </div>
                        </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog for adding a new staff member */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Enter the details for the new salon professional.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Jane Doe"
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane.doe@salon.com"
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Input
                      id="specialties"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      placeholder="e.g., Haircut, Color, Styling"
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Staff</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}