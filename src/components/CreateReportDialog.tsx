import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  MapPin, 
  Loader2, 
  Upload,
  Trash2,
  Leaf,
  Hammer
} from 'lucide-react';
import { getCurrentLocation, reverseGeocode } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateReportDialog: React.FC<CreateReportDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
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

  const reportTypes = [
    { value: 'residuos_solidos', label: 'Residuos Sólidos', icon: Trash2, description: 'Basura acumulada, bolsas rotas' },
    { value: 'maleza', label: 'Maleza', icon: Leaf, description: 'Hierba crecida, arbustos' },
    { value: 'barrido', label: 'Barrido', icon: Hammer, description: 'Calles sucias, hojas, papeles' }
  ];

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

  const handlePhotoUpload = () => {
    // Simular subida de foto
    const mockPhotoUrl = `/api/placeholder/400/300?text=Foto+${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, mockPhotoUrl]
    }));
    
    toast({
      title: "Foto agregada",
      description: "La foto se ha agregado al reporte exitosamente.",
    });
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.location.address) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular envío del reporte
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Reporte enviado",
      description: "Tu reporte ha sido enviado exitosamente. Recibirás una confirmación por email.",
    });
    
    // Limpiar formulario
    setFormData({
      type: '',
      description: '',
      location: { lat: 0, lng: 0, address: '' },
      photos: []
    });
    
    setIsLoading(false);
    onOpenChange(false);
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
                const Icon = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      formData.type === type.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Problema *</Label>
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
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                {isGettingLocation ? 'Obteniendo...' : 'Mi Ubicación'}
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
                onClick={handlePhotoUpload}
                variant="outline"
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Agregar Foto
              </Button>
              
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
                  <Upload className="mr-2 h-4 w-4" />
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