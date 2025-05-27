export interface WSMotorStatus {
  angle: number
  rpm: number
  temperature: number
  vibration: number
  timestamp: number
}

export interface WSMessage {
  event: string
  data: any
  timestamp?: number
}

export interface WSConnectionStatus {
  status: 'connected' | 'disconnected' | 'error'
  message?: string
}