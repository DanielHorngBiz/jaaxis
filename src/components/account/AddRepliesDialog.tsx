import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AddRepliesDialog = () => {
  const [replies, setReplies] = useState([100]);
  const pricePerHundred = 10;
  const totalCost = (replies[0] / 100) * pricePerHundred;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Additional Replies</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Replies to add:</span>
              <span className="text-2xl font-bold">{replies[0].toLocaleString()}</span>
            </div>
            
            <Slider
              value={replies}
              onValueChange={setReplies}
              min={100}
              max={10000}
              step={100}
              className="w-full"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>100</span>
              <span>10,000</span>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Add {replies[0].toLocaleString()} Replies for ${Math.round(totalCost)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepliesDialog;
