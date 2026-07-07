import { useState } from 'react'
import CommunityMap from '../Map/CommunityMap'
import EfficientFrontierView from '../EfficientFrontier/EfficientFrontierView'
import PortfolioBuilder from '../PortfolioBuilder/PortfolioBuilder'
import CommunityDetailPanel from '../CommunityDetail/CommunityDetailPanel'
import Heatmap from '../Heatmap/Heatmap'

export default function Dashboard() {
  const [selectedCommunity, setSelectedCommunity] = useState(null)

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="card h-[45vh]">
          <CommunityMap onSelect={setSelectedCommunity} selected={selectedCommunity} />
        </div>
        <div className="card">
          <Heatmap onSelect={setSelectedCommunity} />
        </div>
      </div>

      <aside className="w-full lg:w-[420px] flex flex-col gap-4 overflow-auto max-h-screen">
        {selectedCommunity && (
          <CommunityDetailPanel community={selectedCommunity} onClose={() => setSelectedCommunity(null)} />
        )}
        <EfficientFrontierView />
        <PortfolioBuilder />
      </aside>
    </div>
  )
}
