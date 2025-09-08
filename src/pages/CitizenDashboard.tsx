import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Leaf,
  Hammer,
  LogOut
} from 'lucide-react';
import { mockReports } from '@/data/mockData';
import { Report } from '@/types';
import CreateReportDialog from '@/components/CreateReportDialog';
import ReportCard from '@/components/ReportCard';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const [showCreateReport, setShowCreateReport] = useState(false);
  
  // Filtrar reportes del ciudadano actual
  const userReports = mockReports.filter(report => report.citizenId === user?.id);
  
  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'primary';
      case 'resuelto': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pendiente': return <Clock className="h-4 w-4" />;
      case 'en_proceso': return <AlertCircle className="h-4 w-4" />;
      case 'resuelto': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'residuos_solidos': return <Trash2 className="h-5 w-5" />;
      case 'maleza': return <Leaf className="h-5 w-5" />;
      case 'barrido': return <Hammer className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'residuos_solidos': return 'Residuos Sólidos';
      case 'maleza': return 'Maleza';
      case 'barrido': return 'Barrido';
      default: return type;
    }
  };

  const statusCounts = {
    pendiente: userReports.filter(r => r.status === 'pendiente').length,
    en_proceso: userReports.filter(r => r.status === 'en_proceso').length,
    resuelto: userReports.filter(r => r.status === 'resuelto').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel Ciudadano</h1>
            <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setShowCreateReport(true)}
              className="bg-gradient-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Reporte
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reportes</p>
                  <p className="text-3xl font-bold">{userReports.length}</p>
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
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resueltos</p>
                  <p className="text-3xl font-bold text-success">{statusCounts.resuelto}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Reportes */}
        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
            <TabsTrigger value="en_proceso">En Proceso</TabsTrigger>
            <TabsTrigger value="resuelto">Resueltos</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-4">
            {userReports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay reportes</h3>
                  <p className="text-muted-foreground mb-4">
                    Aún no has creado ningún reporte. Comienza reportando problemas de limpieza en tu zona.
                  </p>
                  <Button onClick={() => setShowCreateReport(true)}>
                    Crear mi primer reporte
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </TabsContent>

          {(['pendiente', 'en_proceso', 'resuelto'] as const).map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="grid gap-4">
                {userReports
                  .filter(report => report.status === status)
                  .map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
              </div>
              {userReports.filter(report => report.status === status).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    {getStatusIcon(status)}
                    <h3 className="text-lg font-semibold mb-2 mt-4">
                      No hay reportes {status === 'en_proceso' ? 'en proceso' : status}
                    </h3>
                    <p className="text-muted-foreground">
                      No tienes reportes con este estado actualmente.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <CreateReportDialog 
        open={showCreateReport} 
        onOpenChange={setShowCreateReport}
      />
    </div>
  );
};

export default CitizenDashboard;