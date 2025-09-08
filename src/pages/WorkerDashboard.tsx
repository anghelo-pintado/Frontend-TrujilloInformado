import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  Play,
  Camera,
  MapPin,
  User,
  LogOut,
  Upload
} from 'lucide-react';
import { mockTasks } from '@/data/mockData';
import { Task } from '@/types';
import TaskCard from '@/components/TaskCard';
import CompleteTaskDialog from '@/components/CompleteTaskDialog';
import { useToast } from '@/hooks/use-toast';

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filtrar tareas del trabajador actual
  const workerTasks = mockTasks.filter(task => task.workerId === user?.id);
  
  const statusCounts = {
    pendiente: workerTasks.filter(t => t.status === 'pendiente').length,
    en_proceso: workerTasks.filter(t => t.status === 'en_proceso').length,
    completada: workerTasks.filter(t => t.status === 'completada').length
  };

  const handleStartTask = (taskId: string) => {
    toast({
      title: "Tarea iniciada",
      description: "Has comenzado a trabajar en esta tarea.",
    });
  };

  const handleCompleteTask = (task: Task) => {
    setSelectedTask(task);
  };

  const onTaskCompleted = () => {
    toast({
      title: "Tarea completada",
      description: "La tarea ha sido marcada como completada exitosamente.",
    });
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel Trabajador</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tareas</p>
                  <p className="text-3xl font-bold">{workerTasks.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
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
                <Play className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                  <p className="text-3xl font-bold text-success">{statusCounts.completada}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Tareas */}
        <Tabs defaultValue="todas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
            <TabsTrigger value="en_proceso">En Proceso</TabsTrigger>
            <TabsTrigger value="completada">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4">
            {workerTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay tareas asignadas</h3>
                  <p className="text-muted-foreground">
                    Aún no tienes tareas asignadas. Espera a que tu supervisor te asigne trabajo.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {workerTasks.map((task) => (
                  <div key={task.id} className="relative">
                    <TaskCard task={task} />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {task.status === 'pendiente' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartTask(task.id)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Iniciar
                        </Button>
                      )}
                      {task.status === 'en_proceso' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task)}
                          className="bg-gradient-secondary"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {(['pendiente', 'en_proceso', 'completada'] as const).map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="grid gap-4">
                {workerTasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <div key={task.id} className="relative">
                      <TaskCard task={task} />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {status === 'pendiente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartTask(task.id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Iniciar
                          </Button>
                        )}
                        {status === 'en_proceso' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task)}
                            className="bg-gradient-secondary"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              {workerTasks.filter(task => task.status === status).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    {status === 'pendiente' ? <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> :
                     status === 'en_proceso' ? <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> :
                     <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                    <h3 className="text-lg font-semibold mb-2 mt-4">
                      No hay tareas {status === 'en_proceso' ? 'en proceso' : 
                                   status === 'completada' ? 'completadas' : 'pendientes'}
                    </h3>
                    <p className="text-muted-foreground">
                      No tienes tareas con este estado actualmente.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <CompleteTaskDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={() => setSelectedTask(null)}
        onCompleted={onTaskCompleted}
      />
    </div>
  );
};

export default WorkerDashboard;