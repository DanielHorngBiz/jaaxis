import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit2 } from "lucide-react";

const AccountTab = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Account</h2>

      {/* Profile Picture */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">DH</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">PNG, JPG Under 15MB</p>
          </div>
          <div className="flex gap-3">
            <Button>Upload new picture</Button>
            <Button variant="outline">Remove</Button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Personal Info</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" defaultValue="Daniel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="Hung" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="metal666grin@gmail.com" disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input id="password" type="password" defaultValue="········" disabled className="bg-muted" />
              <Button size="icon" variant="ghost" className="flex-shrink-0">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Address</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="street">Street/Avenue</Label>
            <Input id="street" placeholder="Enter street address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Enter city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="Enter state" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal">Postal Code</Label>
            <Input id="postal" placeholder="Enter postal code" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default AccountTab;
