import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Leaf, 
  Hammer,
  User
} from 'lucide-react';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pendiente': return 'secondary';
      case 'en_proceso': return 'outline';
      case 'completada': return 'default';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pendiente': return <Clock className="h-4 w-4" />;
      case 'en_proceso': return <AlertCircle className="h-4 w-4" />;
      case 'completada': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'residuos_solidos': return <Trash2 className="h-5 w-5 text-destructive" />;
      case 'maleza': return <Leaf className="h-5 w-5 text-success" />;
      case 'barrido': return <Hammer className="h-5 w-5 text-secondary" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'residuos_solidos': return 'Residuos Sólidos';
      case 'maleza': return 'Maleza';
      case 'barrido': return 'Barrido';
      default: return type;
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'completada': return 'Completada';
      default: return status;
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

  return (
    <Card className="shadow-card hover:shadow-primary/20 transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {getTypeIcon(task.type)}
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-muted-foreground text-sm">
                {getTypeLabel(task.type)} - Asignada por {task.supervisorName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge variant={getStatusColor(task.status)}>
              {getStatusIcon(task.status)}
              <span className="ml-1">{getStatusLabel(task.status)}</span>
            </Badge>
          </div>
        </div>

        <p className="text-foreground mb-4">{task.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{task.location.address}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Asignada: {new Date(task.assignedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {task.startedAt && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 text-primary">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Iniciada el {new Date(task.startedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {task.evidence && task.evidence.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Evidencia completada:</p>
            <div className="flex space-x-2 overflow-x-auto">
              {task.evidence.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Evidencia ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {task.completedAt && (
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Completada el {new Date(task.completedAt).toLocaleDateString()}
              </span>
            </div>
            {task.notes && (
              <p className="text-sm text-muted-foreground mt-2">{task.notes}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;