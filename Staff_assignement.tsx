import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

interface StaffAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

export function StaffAssignmentDialog({ isOpen, onClose, serviceName }: StaffAssignmentDialogProps) {


  const [selectedStaff, setSelectedStaff] = React.useState<string | null>(null);

  const handleSave = () => {
    console.log(`[STAFF ASSIGNMENT] Assigning staff member ${selectedStaff} to ${serviceName}`);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Staff to Service</DialogTitle>
          <DialogDescription>
            Select the primary staff member for: **{serviceName}**
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="staff-select">Select Staff Member</Label>
            <Select onValueChange={setSelectedStaff} value={selectedStaff || ""}>
              <SelectTrigger id="staff-select">
                <SelectValue placeholder="Choose a Staff Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Emily Davis (ID 1)</SelectItem>
                <SelectItem value="2">James Rodriguez (ID 2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedStaff}>Save Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
