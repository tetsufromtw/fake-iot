'use client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/common/Header'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsPanel from '@/components/dashboard/StatsPanel'
import ControlPanel from '@/components/dashboard/ControlPanel'
import ConnectionStatus from '@/components/dashboard/ConnectionStatus'

// 動態載入 3D 場景以提升效能
const MotorScene = dynamic(
  () => import('@/components/three/MotorScene'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false // 3D 元件不需要 SSR
  }
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 連線狀態列 */}
        <ConnectionStatus />
        
        {/* 主要內容區 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左側統計面板 */}
          <aside className="lg:col-span-3">
            <StatsPanel />
          </aside>
          
          {/* 中間 3D 視圖 */}
          <section className="lg:col-span-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-cyan-400">
                3D Motor Visualization
              </h2>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-950">
                <Suspense fallback={<LoadingSpinner />}>
                  <MotorScene />
                </Suspense>
              </div>
            </div>
          </section>
          
          {/* 右側控制面板 */}
          <aside className="lg:col-span-3">
            <ControlPanel />
          </aside>
        </div>
      </main>
    </div>
  )
}