import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

const AccountTab = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Account</h2>

      {/* Profile Picture */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="" />
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">PNG, JPG Under 15MB</p>
          </div>
          <div className="flex gap-2">
            <Button variant="default">Upload new picture</Button>
            <Button variant="outline">Remove</Button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First name</Label>
            <Input defaultValue="Daniel" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input defaultValue="Hung" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="metal666grin@gmail.com" disabled />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex gap-2">
              <Input type="password" defaultValue="········" disabled />
              <Button size="icon" variant="ghost">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Street/Avenue</Label>
            <Input placeholder="Enter street address" />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input placeholder="Enter city" />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input placeholder="Enter state" />
          </div>
          <div className="space-y-2">
            <Label>Postal Code</Label>
            <Input placeholder="Enter postal code" />
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
