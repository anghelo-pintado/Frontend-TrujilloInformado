import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  UserPlus,
  LogOut,
  Filter
} from 'lucide-react';
import { reportService } from '@/services/reportService';
import { taskService } from '@/services/taskService';
import { Report, Task } from '@/types';
import ReportCard from '@/components/ReportCard';
import AssignTaskDialog from '@/components/AssignTaskDialog';
import { useToast } from '@/hooks/use-toast';

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('todas');
  
  // Estado para reportes y tareas
  const [zoneReports, setZoneReports] = useState<Report[]>([]);
  const [zoneTasks, setZoneTasks] = useState<Task[]>([]);

  React.useEffect(() => {
    const fetchReportsAndTasks = async () => {
      try {
        const allReports = await reportService.getReports();
        setZoneReports(allReports.filter((report: Report) => report.zone === user?.zone));
        const allTasks = await taskService.getTasks();
        setZoneTasks(allTasks.filter((task: Task) => task.supervisorId === user?.id));
      } catch (error) {
        toast({
          title: 'Error al cargar datos',
          description: 'No se pudieron obtener los reportes o tareas del servidor.',
          variant: 'destructive',
        });
      }
    };
    if (user?.zone && user?.id) fetchReportsAndTasks();
  }, [user?.zone, user?.id]);
  
  const filteredReports = zoneReports.filter(report => {
    if (filterPriority === 'todas') return true;
    return report.priority === filterPriority;
  });

  const statusCounts = {
    pendiente: zoneReports.filter(r => r.status === 'PENDIENTE').length,
    en_proceso: zoneReports.filter(r => r.status === 'EN_PROCESO').length,
    resuelto: zoneReports.filter(r => r.status === 'RESUELTO').length
  };

  const priorityCounts = {
    alta: zoneReports.filter(r => r.priority === 'ALTA').length,
    media: zoneReports.filter(r => r.priority === 'MEDIA').length,
    baja: zoneReports.filter(r => r.priority === 'BAJA').length
  };

  const handleAssignTask = (report: Report) => {
    setSelectedReport(report);
  };

  const onTaskAssigned = () => {
    toast({
      title: "Tarea asignada",
      description: "La tarea ha sido asignada exitosamente al trabajador.",
    });
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel Supervisor</h1>
            <p className="text-muted-foreground">
              {user?.name} - {user?.zone}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reportes</p>
                  <p className="text-3xl font-bold">{zoneReports.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-3xl font-bold text-warning">{statusCounts.pendiente}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
                  <p className="text-3xl font-bold text-primary">{statusCounts.en_proceso}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alta Prioridad</p>
                  <p className="text-3xl font-bold text-destructive">{priorityCounts.alta}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta prioridad</SelectItem>
                  <SelectItem value="media">Media prioridad</SelectItem>
                  <SelectItem value="baja">Baja prioridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Gestión */}
        <Tabs defaultValue="reportes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reportes">Reportes Recibidos</TabsTrigger>
            <TabsTrigger value="tareas">Tareas Asignadas</TabsTrigger>
          </TabsList>

          <TabsContent value="reportes" className="space-y-4">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay reportes</h3>
                  <p className="text-muted-foreground">
                    No hay reportes para mostrar con los filtros seleccionados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="relative">
                    <ReportCard report={report} showCitizenInfo />
                    {report.status === 'PENDIENTE' && (
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          onClick={() => handleAssignTask(report)}
                          className="bg-gradient-secondary"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Asignar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tareas" className="space-y-4">
            {zoneTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay tareas asignadas</h3>
                  <p className="text-muted-foreground">
                    Aún no has asignado tareas a ningún trabajador.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {zoneTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-muted-foreground">{task.description}</p>
                        </div>
                        <Badge 
                          variant={
                            task.status === 'completada' ? 'default' :
                            task.status === 'en_proceso' ? 'secondary' : 'outline'
                          }
                        >
                          {task.status === 'completada' ? 'Completada' :
                           task.status === 'en_proceso' ? 'En Proceso' : 'Pendiente'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Trabajador:</span>
                          <p className="font-medium">{task.workerName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Asignada:</span>
                          <p>{new Date(task.assignedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ubicación:</span>
                          <p>{task.location.address}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Prioridad:</span>
                          <Badge 
                            variant={
                              task.priority === 'alta' ? 'destructive' :
                              task.priority === 'media' ? 'secondary' : 'outline'
                            }
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {task.evidence && task.evidence.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Evidencia:</p>
                          <div className="flex space-x-2">
                            {task.evidence.map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Evidencia ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AssignTaskDialog
        report={selectedReport}
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
        onAssigned={onTaskAssigned}
      />
    </div>
  );
};

export default SupervisorDashboard;