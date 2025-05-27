'use client'

export default function Lighting() {
  return (
    <>
      {/* 環境光 - 提供基礎照明 */}
      <ambientLight intensity={0.5} />
      
      {/* 主要方向光 - 模擬陽光 */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* 補光 - 從下方照射 */}
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3}
        color="#4a90e2"
      />
      
      {/* 點光源 - 營造科技感 */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color="#0ea5e9"
        distance={10}
      />
      
      {/* 聚光燈 - 強調馬達 */}
      <spotLight
        position={[3, 5, 3]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        castShadow
        target-position={[0, 0, 0]}
      />
    </>
  )
}