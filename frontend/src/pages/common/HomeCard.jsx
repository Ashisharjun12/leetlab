import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const HomeCard = ({ icon, title, description, badge }) => {
  return (
    <Card className="w-full max-w-xs bg-card border border-border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex flex-col items-start gap-3 p-6">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          {badge && <span className="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-semibold">{badge}</span>}
        </div>
        <div className="font-bold text-lg text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  )
}

export default HomeCard