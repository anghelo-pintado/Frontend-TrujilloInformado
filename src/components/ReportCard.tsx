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
  User,
  Phone
} from 'lucide-react';
import { Report } from '@/types';

interface ReportCardProps {
  report: Report;
  showCitizenInfo?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, showCitizenInfo = false }) => {
  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'PENDIENTE': return 'secondary';
      case 'EN_PROCESO': return 'outline';
      case 'RESUELTO': return 'default';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'PENDIENTE': return <Clock className="h-4 w-4" />;
      case 'EN_PROCESO': return <AlertCircle className="h-4 w-4" />;
      case 'RESUELTO': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'RESIDUOS_SOLIDOS': return <Trash2 className="h-5 w-5 text-destructive" />;
      case 'MALEZA': return <Leaf className="h-5 w-5 text-success" />;
      case 'BARRIDO': return <Hammer className="h-5 w-5 text-secondary" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'RESIDUOS_SOLIDOS': return 'Residuos Sólidos';
      case 'MALEZA': return 'Maleza';
      case 'BARRIDO': return 'Barrido';
      default: return type;
    }
  };

  const getStatusLabel = (status: Report['status']) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_PROCESO': return 'En Proceso';
      case 'RESUELTO': return 'Resuelto';
      default: return status;
    }
  };

  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'ALTA': return 'destructive';
      case 'MEDIA': return 'secondary';
      case 'BAJA': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="shadow-card hover:shadow-primary/20 transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {getTypeIcon(report.type)}
            <div>
              <h3 className="font-semibold text-lg">
                Reporte #{report.id}
              </h3>
              <p className="text-muted-foreground text-sm">
                {getTypeLabel(report.type)} - {report.zone}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(report.priority)}>
              {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
            </Badge>
            <Badge variant={getStatusColor(report.status)}>
              {getStatusIcon(report.status)}
              <span className="ml-1">{getStatusLabel(report.status)}</span>
            </Badge>
          </div>
        </div>

        <p className="text-foreground mb-4">{report.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{report.location.address}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(report.createdAt).toLocaleDateString()} a las{' '}
              {new Date(report.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {showCitizenInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Reportado por:</span>
              <span className="font-medium">{report.citizenName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{report.citizenPhone || 'Sin teléfono'}</span>
            </div>
          </div>
        )}

        {report.photos && report.photos.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Fotos del reporte:</p>
            <div className="flex space-x-2 overflow-x-auto">
              {report.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Foto del reporte ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {report.evidence && report.evidence.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Evidencia de resolución:</p>
            <div className="flex space-x-2 overflow-x-auto">
              {report.evidence.map((photo, index) => (
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

        {report.completedAt && (
          <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Completado el {new Date(report.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportCard;