import { Report, Task, Zone } from '@/types';

export const mockZones: Zone[] = [
  {
    id: '1',
    name: 'Zona Centro',
    supervisorId: '2',
    supervisorName: 'Carlos Rodríguez',
    boundaries: [
      { lat: 4.6097, lng: -74.0817 },
      { lat: 4.6120, lng: -74.0790 },
      { lat: 4.6100, lng: -74.0750 },
      { lat: 4.6070, lng: -74.0780 }
    ]
  },
  {
    id: '2',
    name: 'Zona Norte',
    supervisorId: '4',
    supervisorName: 'Ana López',
    boundaries: [
      { lat: 4.6150, lng: -74.0850 },
      { lat: 4.6180, lng: -74.0820 },
      { lat: 4.6160, lng: -74.0780 },
      { lat: 4.6130, lng: -74.0810 }
    ]
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    citizenId: '1',
    citizenName: 'María García',
    citizenEmail: 'ciudadano@demo.com',
    citizenPhone: '+57 300 123 4567',
    type: 'residuos_solidos',
    description: 'Acumulación de basura en la esquina de la Calle 15 con Carrera 10. Hay varios bolsas rotas y desperdicios esparcidos.',
    location: {
      lat: 4.6097,
      lng: -74.0817,
      address: 'Calle 15 #10-25, Centro, Bogotá'
    },
    photos: ['/api/placeholder/400/300?text=Basura+Acumulada'],
    status: 'pendiente',
    priority: 'alta',
    zone: 'Zona Centro',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    citizenId: '1',
    citizenName: 'María García',
    citizenEmail: 'ciudadano@demo.com',
    type: 'barrido',
    description: 'La calle está muy sucia con hojas y papeles. Necesita barrido urgente.',
    location: {
      lat: 4.6110,
      lng: -74.0800,
      address: 'Carrera 12 #18-30, Centro, Bogotá'
    },
    photos: ['/api/placeholder/400/300?text=Calle+Sucia'],
    status: 'en_proceso',
    priority: 'media',
    zone: 'Zona Centro',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T08:15:00Z',
    assignedTo: '3',
    assignedBy: '2',
    assignedAt: '2024-01-15T08:15:00Z'
  },
  {
    id: '3',
    citizenId: '5',
    citizenName: 'Pedro Silva',
    citizenEmail: 'pedro.silva@email.com',
    type: 'maleza',
    description: 'Maleza creciendo en el separador central de la avenida. Está obstruyendo la visibilidad.',
    location: {
      lat: 4.6085,
      lng: -74.0790,
      address: 'Avenida 19 #14-50, Centro, Bogotá'
    },
    photos: ['/api/placeholder/400/300?text=Maleza+Crecida'],
    status: 'resuelto',
    priority: 'baja',
    zone: 'Zona Centro',
    createdAt: '2024-01-10T09:45:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    assignedTo: '3',
    assignedBy: '2',
    assignedAt: '2024-01-10T11:00:00Z',
    completedAt: '2024-01-12T16:30:00Z',
    evidence: ['/api/placeholder/400/300?text=Maleza+Cortada']
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    reportId: '2',
    workerId: '3',
    workerName: 'Juan Pérez',
    supervisorId: '2',
    supervisorName: 'Carlos Rodríguez',
    title: 'Barrido Carrera 12',
    description: 'La calle está muy sucia con hojas y papeles. Necesita barrido urgente.',
    type: 'barrido',
    location: {
      lat: 4.6110,
      lng: -74.0800,
      address: 'Carrera 12 #18-30, Centro, Bogotá'
    },
    status: 'en_proceso',
    priority: 'media',
    assignedAt: '2024-01-15T08:15:00Z',
    startedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    reportId: '3',
    workerId: '3',
    workerName: 'Juan Pérez',
    supervisorId: '2',
    supervisorName: 'Carlos Rodríguez',
    title: 'Corte de Maleza Avenida 19',
    description: 'Maleza creciendo en el separador central de la avenida. Está obstruyendo la visibilidad.',
    type: 'maleza',
    location: {
      lat: 4.6085,
      lng: -74.0790,
      address: 'Avenida 19 #14-50, Centro, Bogotá'
    },
    status: 'completada',
    priority: 'baja',
    assignedAt: '2024-01-10T11:00:00Z',
    startedAt: '2024-01-10T14:30:00Z',
    completedAt: '2024-01-12T16:30:00Z',
    evidence: ['/api/placeholder/400/300?text=Maleza+Cortada'],
    notes: 'Maleza cortada completamente. Área despejada.'
  }
];

// Función para simular geolocalización
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Ubicación por defecto (Centro de Bogotá)
          resolve({
            lat: 4.6097,
            lng: -74.0817
          });
        }
      );
    } else {
      // Ubicación por defecto
      resolve({
        lat: 4.6097,
        lng: -74.0817
      });
    }
  });
};

// Función para simular geocodificación inversa
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Simular llamada a API de geocodificación
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Direcciones simuladas basadas en las coordenadas
  const addresses = [
    'Calle 15 #10-25, Centro, Bogotá',
    'Carrera 12 #18-30, Centro, Bogotá',
    'Avenida 19 #14-50, Centro, Bogotá',
    'Calle 20 #8-15, Centro, Bogotá',
    'Carrera 9 #16-40, Centro, Bogotá'
  ];
  
  return addresses[Math.floor(Math.random() * addresses.length)];
};