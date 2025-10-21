import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

export default function RegistrationSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      institution: "",
      areaOfInterest: ""
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    createUserMutation.mutate(data);
  };

  return (
    <section id="registro" className="py-12 bg-muted/50" data-testid="section-registration">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-registration-title">
            Únete a Nuestra Biblioteca
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="text-registration-subtitle">
            Registra tu cuenta para acceder a miles de documentos y compartir tus propias obras
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Nombre Completo *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Juan Pérez González"
                  {...register("fullName")}
                  className={errors.fullName ? "border-destructive" : ""}
                  data-testid="input-fullname"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive" data-testid="error-fullname">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.perez@email.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-email">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Número de Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("phone")}
                  data-testid="input-phone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm font-medium text-foreground">
                  Institución/Organización
                </Label>
                <Input
                  id="institution"
                  placeholder="Universidad Nacional"
                  {...register("institution")}
                  data-testid="input-institution"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-foreground">Área de Interés</Label>
                <Select onValueChange={(value) => setValue("areaOfInterest", value)} data-testid="select-area">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar área..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="literatura">Literatura</SelectItem>
                    <SelectItem value="ciencias">Ciencias</SelectItem>
                    <SelectItem value="historia">Historia</SelectItem>
                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                    <SelectItem value="arte">Arte y Cultura</SelectItem>
                    <SelectItem value="educacion">Educación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required data-testid="checkbox-terms" />
                  <Label htmlFor="terms" className="text-sm text-foreground">
                    Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a>
                  </Label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  disabled={createUserMutation.isPending}
                  data-testid="button-submit-registration"
                >
                  {createUserMutation.isPending ? (
                    "Creando cuenta..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crear Cuenta
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
