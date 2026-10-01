import raw from './templates.json'

export type Status = 'VERIFIED' | 'IMPROVED' | 'FIXED'
export type Language = 'Verilog' | 'SystemVerilog'
export interface Template {
  name: string
  filename: string
  category: string
  language: Language
  status: Status
  description: string
  notes: string
  code: string
}

export const templates = raw as Template[]

export const categories = [
  'Combinational', 'Arithmetic', 'Sequential', 'FSM', 'Memory', 'FIFO',
  'Communication', 'Clock-domain Crossing', 'SystemVerilog', 'Verification',
]

export const statuses: Status[] = ['VERIFIED', 'IMPROVED', 'FIXED']

// Point this at the repository once it exists
export const REPO = 'https://github.com/rohankumar2201'
export const LINKEDIN = 'https://www.linkedin.com/in/rohankumar2201/'
