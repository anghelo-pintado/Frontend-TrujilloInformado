import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck, Users, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      setError('Credenciales inválidas');
      return;
    }

    toast({
      title: "Inicio de sesión exitoso",
      description: "Bienvenido al Sistema de Gestión de Reportes",
    });
  };

  const demoUsers = [
    {
      email: 'ciudadano@demo.com',
      role: 'Ciudadano',
      icon: Users,
      description: 'Registra reportes y consulta estados'
    },
    {
      email: 'supervisor@demo.com',
      role: 'Supervisor',
      icon: ShieldCheck,
      description: 'Recibe reportes y asigna tareas'
    },
    {
      email: 'trabajador@demo.com',
      role: 'Trabajador',
      icon: Wrench,
      description: 'Recibe tareas y sube evidencias'
    }
  ];

  const quickLogin = (email: string) => {
    setEmail(email);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema de Gestión de Reportes
          </h1>
          <p className="text-white/80 text-lg">
            Limpieza Pública Municipal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de Login */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.email@municipio.gov.co"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ingresando...
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-warning">Cuentas Demo</CardTitle>
              <CardDescription>
                Prueba el sistema con diferentes roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <strong>Contraseña para todas:</strong> demo123
              </div>
              
              {demoUsers.map((user) => {
                const Icon = user.icon;
                return (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => quickLogin(user.email)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{user.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.description}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Usar
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;