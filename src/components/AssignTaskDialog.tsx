import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserPlus, 
  Loader2, 
  MapPin,
  Clock,
  User
} from 'lucide-react';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AssignTaskDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned: () => void;
}

// Trabajadores simulados disponibles
const availableWorkers = [
  {
    id: '3',
    name: 'Juan Pérez',
    zone: 'Zona Centro',
    specialties: ['barrido', 'residuos_solidos'],
    currentTasks: 2,
    rating: 4.8
  },
  {
    id: '6',
    name: 'Carlos Mendoza',
    zone: 'Zona Centro',
    specialties: ['maleza', 'barrido'],
    currentTasks: 1,
    rating: 4.6
  },
  {
    id: '7',
    name: 'Ana Torres',
    zone: 'Zona Centro',
    specialties: ['residuos_solidos', 'maleza'],
    currentTasks: 3,
    rating: 4.9
  }
];

const AssignTaskDialog: React.FC<AssignTaskDialogProps> = ({ 
  report, 
  open, 
  onOpenChange, 
  onAssigned 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [priority, setPriority] = useState<'baja' | 'media' | 'alta'>('media');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWorker) {
      toast({
        title: "Error",
        description: "Por favor selecciona un trabajador.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular asignación de tarea
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const worker = availableWorkers.find(w => w.id === selectedWorker);
    
    toast({
      title: "Tarea asignada exitosamente",
      description: `La tarea ha sido asignada a ${worker?.name}. Se le notificará inmediatamente.`,
    });
    
    // Limpiar formulario
    setSelectedWorker('');
    setPriority('media');
    setNotes('');
    setIsLoading(false);
    
    onAssigned();
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'residuos_solidos': return 'Residuos Sólidos';
      case 'maleza': return 'Maleza';
      case 'barrido': return 'Barrido';
      default: return type;
    }
  };

  const getPriorityColor = (priority: 'baja' | 'media' | 'alta') => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'secondary';
      case 'baja': return 'outline';
      default: return 'outline';
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar Tarea a Trabajador</DialogTitle>
          <DialogDescription>
            Asigna este reporte a un trabajador disponible en la zona.
          </DialogDescription>
        </DialogHeader>

        {/* Información del Reporte */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">Reporte #{report.id}</h3>
              <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{report.location.address}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Trabajador */}
          <div className="space-y-3">
            <Label>Seleccionar Trabajador *</Label>
            <div className="grid gap-3">
              {availableWorkers.map((worker) => {
                const hasSpecialty = worker.specialties.includes(report.type);
                return (
                  <Card
                    key={worker.id}
                    className={`cursor-pointer transition-all ${
                      selectedWorker === worker.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedWorker(worker.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <User className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{worker.name}</h4>
                            <p className="text-sm text-muted-foreground">{worker.zone}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs">Especialidades:</span>
                              <div className="flex space-x-1">
                                {worker.specialties.map((specialty) => (
                                  <Badge 
                                    key={specialty} 
                                    variant="outline" 
                                    className="text-xs"
                                  >
                                    {getTypeLabel(specialty as Report['type'])}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {hasSpecialty && (
                              <Badge variant="default" className="text-xs">
                                Especialista
                              </Badge>
                            )}
                            <Badge variant="outline">
                              ⭐ {worker.rating}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {worker.currentTasks} tareas activas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Prioridad */}
          <div className="space-y-2">
            <Label>Prioridad de la Tarea</Label>
            <Select value={priority} onValueChange={(value: 'baja' | 'media' | 'alta') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">Baja Prioridad</SelectItem>
                <SelectItem value="media">Media Prioridad</SelectItem>
                <SelectItem value="alta">Alta Prioridad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas para el Trabajador (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Instrucciones especiales, herramientas necesarias, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Vista previa de la asignación */}
          {selectedWorker && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Resumen de Asignación</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Trabajador:</span>
                    <span className="font-medium">
                      {availableWorkers.find(w => w.id === selectedWorker)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipo de trabajo:</span>
                    <span>{getTypeLabel(report.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prioridad:</span>
                    <Badge variant={getPriorityColor(priority)}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedWorker}
              className="bg-gradient-secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Asignar Tarea
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;