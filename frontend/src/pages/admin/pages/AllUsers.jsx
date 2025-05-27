import React, { useEffect, useState } from 'react'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const AllUsers = () => {
  const { users, isLoading, getAllUsers, changeRole } = useAdminStore();
  const { authUser } = useAuthStore();
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleRoleChange = async (userId, currentRole) => {
    if (!authUser) {
      toast.error("You must be logged in to change roles");
      return;
    }

    try {
      setChangingRole(true);
      const response = await changeRole(userId);
      if (response?.data?.success) {
        toast.success(response.data.message);
        // Update the local state immediately
        const updatedUsers = users.map(user => 
          user.id === userId 
            ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
            : user
        );
        useAdminStore.setState({ users: updatedUsers });
      } else {
        toast.error(response?.data?.message || 'Failed to change role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change role');
    } finally {
      setChangingRole(false);
    }
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Joined</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-b-0">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`role-${user.id}`}
                          checked={user.role === 'admin'}
                          onCheckedChange={() => handleRoleChange(user.id, user.role)}
                          disabled={changingRole || user.id === authUser?.id}
                        />
                        <Label htmlFor={`role-${user.id}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </Label>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllUsers 