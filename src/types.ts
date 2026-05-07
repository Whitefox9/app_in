export type AttendanceStatus = 'A' | 'CE' | 'SE' | 'T'

export type TabKey = 'home' | 'fichas' | 'attendance' | 'agenda' | 'profile'

export interface Instructor {
  id: string
  name: string
  document: string
  knowledgeArea: string
  contractType: string
  weeklyHours: number
  mainCampus: string
  email: string
}

export interface Learner {
  id: string
  name: string
  documentType: string
  documentNumber: string
  document: string
  phone: string
  email: string
}

export interface TrainingGroup {
  id: string
  number: string
  program: string
  trainingType: 'Titulada' | 'Articulación' | 'Complementaria'
  startDate: string
  shift: string
  location: string
  locationType: 'Ambiente' | 'Colegio'
  environment: string
  schedule: string
  learnerIds: string[]
  status: 'Activa' | 'Finalizada'
}

export interface ClassSession {
  id: string
  groupId: string
  date: string
  time: string
  location: string
  program: string
  status: 'Programada' | 'En curso' | 'Finalizada'
}

export interface AttendanceRecord {
  id: string
  groupId: string
  date: string
  statuses: Record<string, AttendanceStatus>
  savedAt: string
}

export interface AttendanceSummary {
  A: number
  CE: number
  SE: number
  T: number
}

export interface FichaNovelty {
  id: string
  groupId: string
  type: string
  observation: string
  date: string
  savedAt: string
}
