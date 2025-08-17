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
        {/* Left Sidebar - 1 column, same height as main area */}
        <aside className="lg:col-span-1 h-full">
          <div className="h-screen">
            {leftSidebar}
          </div>
        </aside>
           
        {/* Main Game Area - 3 columns */}
        <main className="lg:col-span-3 h-full">
          <div className="h-full">
            {mainContent}
          </div>
        </main>

        {/* Right Sidebar - 1 column, same height as main area */}
        <aside className="lg:col-span-1 h-full">
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