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
import { taskService } from '@/services/taskService';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([]);

  const handleAddPhoto = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    try {
      const result = await taskService.uploadImage(file);
      const photoUrl = result.url || result.secure_url || result;
      setEvidencePhotos(prev => [...prev, photoUrl]);

      toast({
        title: "Foto agregada",
        description: "Evidencia fotográfica agregada exitosamente.",
      });
      
    }
    catch {
      toast({
        title: "Error",
        description: "No se pudo subir la evidencia fotográfica.",
        variant: "destructive"
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setEvidencePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task || !user) {
      toast({
        title: "Error",
        description: "No se puede completar la tarea en este momento.",
        variant: "destructive"
      });
      return;
    }

    if (evidencePhotos.length === 0) {
      toast({
        title: "Error",
        description: "Por favor agrega al menos una foto como evidencia del trabajo completado.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar tarea como completada
      const taskUpdate = {
        ...task,
        status: 'RESUELTO' as const,
        completedAt: new Date().toISOString(),
        notes: notes || null,
      };

      await taskService.updateTask(task.id, taskUpdate);
      
      // Guardar fotos
      //const evidencePromises = evidencePhotos.map(photoUrl => 
        //  taskService.createEvidence({
          //taskId: task.id,
         // uploadedBy: user.id,
         // url: photoUrl
      //  })
     // );
      //await Promise.all(evidencePromises);

      toast({
        title: "Tarea completada exitosamente",
        description: "La tarea ha sido marcada como completada. El supervisor y el ciudadano serán notificados.",
      });
    
      // Limpiar formulario
      setNotes('');
      setEvidencePhotos([]);
      setIsLoading(false);
      
      onCompleted();
    }
    catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la tarea. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'RESIDUOS_SOLIDOS': return 'Residuos Sólidos';
      case 'MALEZA': return 'Maleza';
      case 'BARRIDO': return 'Barrido';
      default: return type;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'ALTA': return 'destructive';
      case 'MEDIA': return 'secondary';
      case 'BAJA': return 'outline';
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
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                id="evidence-photo-input"
                onChange={handleAddPhoto}
              />
              <Button
                type="button"
                onClick={() => document.getElementById('evidence-photo-input')?.click()}
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