import React from 'react'

const AdminRightSide = ({ children }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      {children}
    </div>
  )
}

export default AdminRightSide