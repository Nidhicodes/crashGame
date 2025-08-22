import { ReactNode } from "react"

interface GameContentProps {
  leftSidebar: ReactNode
  mainContent: ReactNode
  rightSidebar: ReactNode
  bottomContent: ReactNode
}

export function GameContent({ 
  leftSidebar, 
  mainContent, 
  rightSidebar, 
  bottomContent 
}: GameContentProps) {
  return (
    <>
      {/* Main Content Grid with equal heights */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Main Game Area - First on mobile, middle on desktop */}
        <main className="order-1 lg:order-2 lg:col-span-3 h-full">
          <div className="h-full">
            {mainContent}
          </div>
        </main>

        {/* Left Sidebar - Second on mobile, first on desktop */}
        <aside className="order-2 lg:order-1 lg:col-span-1 h-full">
          <div className="md:h-screen">
            {leftSidebar}
          </div>
        </aside>

        {/* Right Sidebar - Always last */}
        <aside className="order-3 lg:order-3 lg:col-span-1 h-full">
          <div className="h-full">
            {rightSidebar}
          </div>
        </aside>
      </div>

      {/* Bottom Tabs - Full width */}
      <div className="w-full">
        {bottomContent}
      </div>
    </>
  )
}
