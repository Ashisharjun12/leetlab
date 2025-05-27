import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AdminSettings = () => {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input placeholder="Enter site name" />
          </div>
          <div className="space-y-2">
            <Label>Admin Email</Label>
            <Input type="email" placeholder="Enter admin email" />
          </div>
          <div className="space-y-2">
            <Label>Max Problems Per User</Label>
            <Input type="number" placeholder="Enter max problems" />
          </div>
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings 