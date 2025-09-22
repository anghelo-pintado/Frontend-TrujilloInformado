import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Camera, 
  Trash2, 
  Leaf, 
  Hammer, 
  Loader2, 
  X,
  Navigation
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { reportService } from '@/services/reportService';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportCreated?: () => void;
}

const CreateReportDialog: React.FC<CreateReportDialogProps> = ({ 
  open, 
  onOpenChange,
  onReportCreated 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    photos: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reportTypes = [
    { value: 'RESIDUOS_SOLIDOS', label: 'Residuos Sólidos', icon: Trash2, description: 'Basura acumulada, bolsas rotas' },
    { value: 'MALEZA', label: 'Maleza', icon: Leaf, description: 'Hierba crecida, arbustos' },
    { value: 'BARRIDO', label: 'Barrido', icon: Hammer, description: 'Calles sucias, hojas, papeles' }
  ];

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || `Lat: ${lat}, Lng: ${lng}`;
  };

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.lat, location.lng);
      
      setFormData(prev => ({
        ...prev,
        location: {
          lat: location.lat,
          lng: location.lng,
          address
        }
      }));
      
      toast({
        title: "Ubicación obtenida",
        description: "Se ha capturado tu ubicación actual exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener la ubicación. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePhotoUpload = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    try {
      const result = await reportService.uploadImage(file);
      const photoUrl = result.url || result.secure_url || result;
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl]
      }));

      toast({
        title: "Foto agregada",
        description: "La foto se ha agregado al reporte exitosamente.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo subir la foto.",
        variant: "destructive"
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const getPriorityByType = (type: string) => {
    switch (type) {
      case 'RESIDUOS_SOLIDOS':
        return 'ALTA';
      case 'BARRIDO':
        return 'MEDIA';
      case 'MALEZA':
        return 'BAJA';
      default:
        return 'MEDIA';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.location.address) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const reportData = {
        type: formData.type as 'RESIDUOS_SOLIDOS' | 'MALEZA' | 'BARRIDO',
        description: formData.description,
        location: formData.location,
        photos: formData.photos,
        priority: getPriorityByType(formData.type) as 'ALTA' | 'MEDIA' | 'BAJA',
        zone: 'Zona Centro', // Esto deberías determinarlo basado en la ubicación
        status: 'PENDIENTE' as const,
        citizenId: user?.id,
        citizenName: user?.name,
        citizenPhone: user?.phone,
        citizenEmail: user?.email
      };

      await reportService.createReport(reportData);
      
      toast({
        title: "Reporte enviado",
        description: "Tu reporte ha sido enviado exitosamente.",
      });
      
      // Limpiar formulario
      setFormData({
        type: '',
        description: '',
        location: { lat: 0, lng: 0, address: '' },
        photos: []
      });
      
      onOpenChange(false);
      
      // Notificar al componente padre
      if (onReportCreated) {
        onReportCreated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Reporte</DialogTitle>
          <DialogDescription>
            Reporta problemas de limpieza pública en tu zona. Incluye fotos y ubicación para mejor atención.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Reporte */}
          <div className="space-y-3">
            <Label>Tipo de Reporte *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Problema</Label>
            <Textarea
              id="description"
              placeholder="Describe detalladamente el problema que observas..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-3">
            <Label>Ubicación *</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                variant="outline"
                className="flex-shrink-0"
              >
                {isGettingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="mr-2 h-4 w-4" />
                )}
                Ubicación Actual
              </Button>
              <Input
                placeholder="O ingresa la dirección manualmente"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                required
              />
            </div>
          </div>

          {/* Fotos */}
          <div className="space-y-3">
            <Label>Fotos del Problema</Label>
            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Agregar Foto
              </Button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
              disabled={isLoading}
              className="bg-gradient-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Enviar Reporte
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;