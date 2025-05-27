import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="h-full bg-background">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dashboard cards */}
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Total Problems</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard