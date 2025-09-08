import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Loader2, 
  CheckCircle,
  Upload,
  MapPin,
  Clock
} from 'lucide-react';
import { Task } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CompleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void;
}

const CompleteTaskDialog: React.FC<CompleteTaskDialogProps> = ({ 
  task, 
  open, 
  onOpenChange, 
  onCompleted 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([]);

  const handleAddPhoto = () => {
    // Simular captura de foto
    const mockPhotoUrl = `/api/placeholder/400/300?text=Evidencia+${Date.now()}`;
    setEvidencePhotos(prev => [...prev, mockPhotoUrl]);
    
    toast({
      title: "Foto agregada",
      description: "Evidencia fotográfica agregada exitosamente.",
    });
  };

  const handleRemovePhoto = (index: number) => {
    setEvidencePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (evidencePhotos.length === 0) {
      toast({
        title: "Error",
        description: "Por favor agrega al menos una foto como evidencia del trabajo completado.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular completar tarea
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Tarea completada exitosamente",
      description: "La tarea ha sido marcada como completada. El supervisor y el ciudadano serán notificados.",
    });
    
    // Limpiar formulario
    setNotes('');
    setEvidencePhotos([]);
    setIsLoading(false);
    
    onCompleted();
  };

  const getTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'residuos_solidos': return 'Residuos Sólidos';
      case 'maleza': return 'Maleza';
      case 'barrido': return 'Barrido';
      default: return type;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'secondary';
      case 'baja': return 'outline';
      default: return 'outline';
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Completar Tarea</DialogTitle>
          <DialogDescription>
            Sube evidencia fotográfica del trabajo completado y agrega notas adicionales.
          </DialogDescription>
        </DialogHeader>

        {/* Información de la Tarea */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">{task.title}</h3>
              <div className="flex space-x-2">
                <Badge variant="outline">{getTypeLabel(task.type)}</Badge>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{task.location.address}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Asignada: {new Date(task.assignedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Evidencia Fotográfica */}
          <div className="space-y-3">
            <Label>Evidencia Fotográfica * (Mínimo 1 foto)</Label>
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleAddPhoto}
                variant="outline"
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Tomar Foto de Evidencia
              </Button>
              
              {evidencePhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {evidencePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Evidencia ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Toma fotos que muestren claramente el trabajo completado: área limpia, residuos recogidos, maleza cortada, etc.
            </p>
          </div>

          {/* Notas del Trabajador */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Describe el trabajo realizado, materiales utilizados, observaciones especiales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Vista previa de completación */}
          {evidencePhotos.length > 0 && (
            <Card className="bg-success/10 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h4 className="font-medium text-success">Listo para completar</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fotos de evidencia:</span>
                    <span className="font-medium">{evidencePhotos.length} foto(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notas adicionales:</span>
                    <span className="font-medium">{notes ? 'Sí' : 'No'}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Al completar la tarea, se notificará automáticamente al supervisor y al ciudadano que reportó el problema.
                  </p>
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
              disabled={isLoading || evidencePhotos.length === 0}
              className="bg-gradient-secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completar Tarea
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteTaskDialog;