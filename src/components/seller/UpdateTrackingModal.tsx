import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function UpdateTrackingModal({ orderId, onClose }: any) {
  const [tracking, setTracking] = useState({ id: "", status: "Shipped" });

  const handleUpdate = async () => {
    await fetch(`/api/seller/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, tracking }),
    });
    onClose();
  };

  return (
    <Dialog open={!!orderId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Tracking Info</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Tracking ID"
          value={tracking.id}
          onChange={(e) => setTracking({ ...tracking, id: e.target.value })}
        />
        <Input
          placeholder="Status"
          value={tracking.status}
          onChange={(e) => setTracking({ ...tracking, status: e.target.value })}
        />
        <Button onClick={handleUpdate}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}