'use client'

import { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsClientProps {
  defaultTab: string
  tabs: Tab[]
}

export function TabsClient({ defaultTab, tabs }: TabsClientProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div>
      <div className="flex gap-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  )
}
