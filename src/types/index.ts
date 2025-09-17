export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ciudadano' | 'supervisor' | 'trabajador';
  phone?: string;
  zone?: string; // Para supervisores y trabajadores
}

export interface Report {
  id: string; 
  citizenId: string; 
  citizenName: string; 
  citizenEmail: string; 
  citizenPhone?: string; 
  type: 'BARRIDO' | 'RESIDUOS_SOLIDOS' | 'MALEZA'; 
  description: string; 
  location: { lat: number; lng: number; address: string; }; 
  photos: string[]; 
  status: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO'; 
  priority: 'BAJA' | 'MEDIA' | 'ALTA'; 
  zone: string; 
  createdAt: string; 
  updatedAt: string; 
  assignedTo?: string; // ID del trabajador 
  assignedBy?: string; // ID del supervisor 
  assignedAt?: string; 
  completedAt?: string; 
  evidence?: string[]; // Fotos de evidencia del trabajador
}

export interface Task {
  id: string;
  reportId: string;
  workerId: string;
  workerName: string;
  supervisorId: string;
  supervisorName: string;
  title: string;
  description: string;
  type: 'barrido' | 'residuos_solidos' | 'maleza';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pendiente' | 'en_proceso' | 'completada';
  priority: 'baja' | 'media' | 'alta';
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  evidence?: string[];
  notes?: string;
}

export interface Zone {
  id: string;
  name: string;
  supervisorId: string;
  supervisorName: string;
  boundaries: {
    lat: number;
    lng: number;
  }[];
}

export type ReportStatus = Report['status'];
export type ReportType = Report['type'];
export type UserRole = User['role'];
export type Priority = Report['priority'];