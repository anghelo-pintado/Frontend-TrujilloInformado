import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/hooks/useReports';
import { 
  MapPin, 
  Plus, 
  LogOut, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Leaf, 
  Hammer,
  Loader2
} from 'lucide-react';
import CreateReportDialog from '@/components/CreateReportDialog';
import ReportCard from '@/components/ReportCard';
import { Report } from '@/types';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const { reports, loading, error, fetchReports } = useReports();
  const [showCreateReport, setShowCreateReport] = useState(false);
  
  // Asegurar que reports es un array antes de filtrar
  const safeReports = Array.isArray(reports) ? reports : [];
  
  // Filtrar reportes del ciudadano actual
  const userReports = safeReports.filter(report => String(report.citizenId) === String(user?.id));


  console.log('Reports in dashboard:', reports);
  console.log('Safe reports:', safeReports);
  console.log('User reports:', userReports);

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'PENDIENTE': return 'warning';
      case 'EN_PROCESO': return 'primary';
      case 'RESUELTO': return 'success';
      default: return 'secondary';
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
      case 'RESIDUOS_SOLIDOS': return <Trash2 className="h-5 w-5" />;
      case 'MALEZA': return <Leaf className="h-5 w-5" />;
      case 'BARRIDO': return <Hammer className="h-5 w-5" />;
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

  const statusCounts = {
    pendiente: userReports.filter(r => r.status === 'PENDIENTE').length,
    en_proceso: userReports.filter(r => r.status === 'EN_PROCESO').length,
    resuelto: userReports.filter(r => r.status === 'RESUELTO').length
  };

  const handleReportCreated = async () => {
    await fetchReports(); // Refrescar los reportes después de crear uno nuevo
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchReports} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

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
                  <p className="text-3xl font-bold">{statusCounts.pendiente}</p>
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
                  <p className="text-3xl font-bold">{statusCounts.en_proceso}</p>
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
                  <p className="text-3xl font-bold">{statusCounts.resuelto}</p>
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
                  <h3 className="text-lg font-medium mb-2">No tienes reportes aún</h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza reportando problemas en tu comunidad
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

          {(['PENDIENTE', 'EN_PROCESO', 'RESUELTO'] as const).map((status) => (
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
                    <div className="text-muted-foreground">
                      {getStatusIcon(status)}
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No hay reportes {status.replace('_', ' ')}
                    </h3>
                    <p className="text-muted-foreground">
                      Los reportes aparecerán aquí cuando cambien de estado
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
        onReportCreated={handleReportCreated}
      />
    </div>
  );
};

export default CitizenDashboard;