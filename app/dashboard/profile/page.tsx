"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateUserProfile } from "@/services/api/auth"

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  loyaltyPoints?: number;
}

interface GuestProfilePageProps {
  userData: UserData;
}

export default function GuestProfilePage({ userData }: GuestProfilePageProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: userData.name.split(" ")[0] || "",
    lastName: userData.name.split(" ")[1] || "",
    email: userData.email || "",
    phone: "+1234567890", // Placeholder, assuming phone is not in userData yet
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // Simulate API call to save profile
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log("Saving profile:", profileData)
    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully saved.",
      variant: "default",
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-medium text-primary mb-6">My Profile</h1>

        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-primary">Personal Information</CardTitle>
            <CardDescription>Update your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Receive booking confirmations and updates via email.</p>
                  </div>
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={profileData.emailNotifications}
                    onChange={(e) => setProfileData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-xs text-gray-500">Receive booking reminders via SMS.</p>
                  </div>
                  <input
                    id="smsNotifications"
                    type="checkbox"
                    checked={profileData.smsNotifications}
                    onChange={(e) => setProfileData(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 