import { User, Building2, Shield, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and organisation details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-navy flex items-center gap-2">
                <User className="h-4 w-4 text-teal" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="Chukwuemeka" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Obi" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue="c.obi@apexshipping.ng" type="email" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input defaultValue="+234 802 345 6789" />
              </div>
              <Button variant="teal" size="sm">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-navy flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal" />
                Organisation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organisation Name</Label>
                  <Input defaultValue="Apex Shipping Ltd" />
                </div>
                <div className="space-y-2">
                  <Label>RC Number</Label>
                  <Input defaultValue="RC-0234561" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registered Address</Label>
                <Input defaultValue="15 Marina Way, Lagos Island, Lagos State" />
              </div>
              <Button variant="outline" size="sm">Update Organisation</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-navy flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge variant="processing">Operator</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">2FA</span>
                <Badge variant="warning">Not Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm text-gray-700">Jan 15, 2026</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-navy flex items-center gap-2">
                <Bell className="h-4 w-4 text-teal" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Payment Receipts", enabled: true },
                { label: "Assessment Alerts", enabled: true },
                { label: "Settlement Updates", enabled: false },
                { label: "Platform Notices", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-600">{item.label}</span>
                  <div
                    className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${item.enabled ? "bg-teal" : "bg-gray-200"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${item.enabled ? "translate-x-4" : ""}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
