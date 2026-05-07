import type {
  AttendanceRecord,
  AttendanceStatus,
  ClassSession,
  Instructor,
  Learner,
  TrainingGroup,
} from '../types'

export const instructor: Instructor = {
  id: 'ins-001',
  name: 'Diana Marcela Rojas',
  document: '52.418.930',
  knowledgeArea: 'Software y transformación digital',
  contractType: 'Contratista',
  weeklyHours: 32,
  mainCampus: 'Centro de Servicios Financieros',
  email: 'diana.rojas@sena.edu.co',
}

const learnerSeed = [
  ['apr-001', 'Laura Camila Torres', '1002458912', '300 541 9021', 'laura.torres@email.com'],
  ['apr-002', 'Miguel Angel Pardo', '1013254788', '311 908 4407', 'miguel.pardo@email.com'],
  ['apr-003', 'Sofia Martinez Lemos', '1007421659', '312 778 2185', 'sofia.martinez@email.com'],
  ['apr-004', 'Juan David Romero', '1020845761', '320 414 8920', 'juan.romero@email.com'],
  ['apr-005', 'Valentina Suarez Mora', '1003987120', '301 255 7804', 'valentina.suarez@email.com'],
  ['apr-006', 'Samuel Ortiz Quiroga', '1031145892', '315 700 2144', 'samuel.ortiz@email.com'],
  ['apr-007', 'Daniela Paola Cruz', '1018942301', '313 671 0023', 'daniela.cruz@email.com'],
  ['apr-008', 'Andres Felipe Gil', '1025521367', '302 889 7341', 'andres.gil@email.com'],
  ['apr-009', 'Maria Jose Acosta', '1008654190', '314 810 2398', 'maria.acosta@email.com'],
  ['apr-010', 'Cristian Camilo Nino', '1033577015', '316 771 6509', 'cristian.nino@email.com'],
  ['apr-011', 'Juliana Vargas Pena', '1017742398', '300 928 1160', 'juliana.vargas@email.com'],
  ['apr-012', 'Nicolas Alejandro Ruiz', '1020336744', '317 604 8325', 'nicolas.ruiz@email.com'],
  ['apr-013', 'Sara Manuela Cardenas', '1009456132', '301 554 7119', 'sara.cardenas@email.com'],
  ['apr-014', 'Diego Armando Silva', '1016509981', '311 225 0408', 'diego.silva@email.com'],
  ['apr-015', 'Natalia Becerra Leon', '1002348765', '320 781 4582', 'natalia.becerra@email.com'],
  ['apr-016', 'Brayan Stiven Rios', '1029073468', '312 690 1442', 'brayan.rios@email.com'],
  ['apr-017', 'Isabella Herrera Cely', '1013014455', '313 502 7708', 'isabella.herrera@email.com'],
  ['apr-018', 'Kevin Mauricio Cano', '1036004420', '315 672 9001', 'kevin.cano@email.com'],
  ['apr-019', 'Paula Andrea Rangel', '1007001235', '300 410 7892', 'paula.rangel@email.com'],
  ['apr-020', 'Esteban Felipe Molina', '1024778109', '318 224 5501', 'esteban.molina@email.com'],
  ['apr-021', 'Luisa Fernanda Alba', '1019876532', '316 411 2390', 'luisa.alba@email.com'],
  ['apr-022', 'Mateo Alejandro Castro', '1023589041', '301 888 1002', 'mateo.castro@email.com'],
  ['apr-023', 'Camila Alejandra Diaz', '1006547891', '314 905 3328', 'camila.diaz@email.com'],
  ['apr-024', 'Sebastian Morales Vera', '1030245618', '311 604 9817', 'sebastian.morales@email.com'],
  ['apr-025', 'Mariana Pineda Soler', '1014689702', '317 809 4510', 'mariana.pineda@email.com'],
  ['apr-026', 'Jose Luis Pedraza', '1027458963', '302 211 0076', 'jose.pedraza@email.com'],
  ['apr-027', 'Karen Tatiana Mejia', '1008173645', '315 990 4122', 'karen.mejia@email.com'],
  ['apr-028', 'Oscar Javier Bernal', '1035447106', '320 100 5643', 'oscar.bernal@email.com'],
] as const

export const learners: Learner[] = learnerSeed.map(([id, name, documentNumber, phone, email]) => ({
  id,
  name,
  documentType: 'CC',
  documentNumber,
  document: documentNumber,
  phone,
  email,
}))

export const groups: TrainingGroup[] = [
  {
    id: 'fic-2847512',
    number: '2847512',
    program: 'Análisis y desarrollo de software',
    trainingType: 'Titulada',
    startDate: '2026-03-02',
    shift: 'Mañana',
    location: 'Ambiente 304 - Sede Principal',
    locationType: 'Ambiente',
    environment: 'Ambiente TIC 304',
    schedule: 'Lunes a viernes, 6:00 a.m. - 12:00 m.',
    learnerIds: learners.slice(0, 18).map((learner) => learner.id),
    status: 'Activa',
  },
  {
    id: 'fic-2891044',
    number: '2891044',
    program: 'Programación de aplicaciones móviles',
    trainingType: 'Articulación',
    startDate: '2026-03-10',
    shift: 'Tarde',
    location: 'Colegio Distrital Paulo Freire',
    locationType: 'Colegio',
    environment: 'Sala de sistemas B',
    schedule: 'Martes y jueves, 1:00 p.m. - 5:00 p.m.',
    learnerIds: learners.slice(18, 28).map((learner) => learner.id),
    status: 'Activa',
  },
  {
    id: 'fic-2768891',
    number: '2768891',
    program: 'Bases de datos para analítica',
    trainingType: 'Complementaria',
    startDate: '2026-03-16',
    shift: 'Noche',
    location: 'Ambiente 211 - Nodo Empresarial',
    locationType: 'Ambiente',
    environment: 'Laboratorio de datos 211',
    schedule: 'Lunes, miércoles y viernes, 6:00 p.m. - 9:30 p.m.',
    learnerIds: learners.slice(4, 16).map((learner) => learner.id),
    status: 'Activa',
  },
]

export const sessions: ClassSession[] = [
  {
    id: 'ses-001',
    groupId: 'fic-2847512',
    date: '2026-04-28',
    time: '6:00 a.m. - 12:00 m.',
    location: 'Ambiente TIC 304',
    program: 'Análisis y desarrollo de software',
    status: 'En curso',
  },
  {
    id: 'ses-002',
    groupId: 'fic-2891044',
    date: '2026-04-28',
    time: '1:00 p.m. - 5:00 p.m.',
    location: 'Colegio Distrital Paulo Freire',
    program: 'Programación de aplicaciones móviles',
    status: 'Programada',
  },
  {
    id: 'ses-003',
    groupId: 'fic-2768891',
    date: '2026-04-29',
    time: '6:00 p.m. - 9:30 p.m.',
    location: 'Laboratorio de datos 211',
    program: 'Bases de datos para analítica',
    status: 'Programada',
  },
]

const attendanceDates = [
  '2026-05-06',
  '2026-05-04',
  '2026-04-30',
  '2026-04-28',
  '2026-04-24',
  '2026-04-22',
  '2026-04-20',
  '2026-04-16',
  '2026-04-14',
  '2026-04-10',
]
const statusCycle: AttendanceStatus[] = ['A', 'A', 'T', 'A', 'CE', 'A', 'SE']

function buildGroupStatuses(learnerIds: string[], callIndex: number): Record<string, AttendanceStatus> {
  return learnerIds.reduce<Record<string, AttendanceStatus>>((statuses, learnerId, learnerIndex) => {
    statuses[learnerId] = statusCycle[(learnerIndex + callIndex) % statusCycle.length]
    return statuses
  }, {})
}

function buildGroupAttendanceRecords(group: TrainingGroup): AttendanceRecord[] {
  return attendanceDates.map((date, index) => ({
    id: `asi-${group.id}-${date}`,
    groupId: group.id,
    date,
    savedAt: `${date}T11:55:00`,
    statuses: buildGroupStatuses(group.learnerIds, index),
  }))
}

export const attendanceRecords: AttendanceRecord[] = groups.flatMap((group) =>
  buildGroupAttendanceRecords(group),
)
