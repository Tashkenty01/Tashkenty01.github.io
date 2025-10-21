import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDocumentSchema, type InsertDocument } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, Upload } from "lucide-react";
import { useState, useRef } from "react";

type UploadFormData = InsertDocument & {
  file?: FileList;
};

const uploadSchema = insertDocumentSchema;

export default function UploadSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      year: undefined,
      description: "",
      keywords: "",
      uploadedBy: undefined
    }
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: UploadFormData) => {
      if (!selectedFile) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("category", data.category);
      if (data.year) formData.append("year", data.year.toString());
      if (data.description) formData.append("description", data.description);
      if (data.keywords) formData.append("keywords", data.keywords);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Documento subido exitosamente!",
        description: "Tu documento ha sido publicado en la biblioteca.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
    },
    onError: (error: any) => {
      toast({
        title: "Error al subir documento",
        description: error.message || "No se pudo subir el documento. Inténtalo de nuevo.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Formato no válido",
          description: "Solo se permiten archivos PDF.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo no puede superar los 50MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const onSubmit = (data: UploadFormData) => {
    if (!selectedFile) {
      toast({
        title: "Archivo requerido",
        description: "Por favor selecciona un archivo PDF para subir.",
        variant: "destructive",
      });
      return;
    }
    uploadDocumentMutation.mutate(data);
  };

  return (
    <section id="subir" className="py-12" data-testid="section-upload">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-upload-title">
            Subir Nuevo Documento
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="text-upload-subtitle">
            Comparte tus libros, novelas y cuentos con la comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6" data-testid="text-document-info">
                Información del Documento
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Cien años de soledad"
                    {...register("title")}
                    className={errors.title ? "border-destructive" : ""}
                    data-testid="input-title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive" data-testid="error-title">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium text-foreground">
                    Autor *
                  </Label>
                  <Input
                    id="author"
                    placeholder="Gabriel García Márquez"
                    {...register("author")}
                    className={errors.author ? "border-destructive" : ""}
                    data-testid="input-author"
                  />
                  {errors.author && (
                    <p className="text-sm text-destructive" data-testid="error-author">
                      {errors.author.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Categoría *</Label>
                    <Select onValueChange={(value) => setValue("category", value)} data-testid="select-category">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novela">Novela</SelectItem>
                        <SelectItem value="cuento">Cuento</SelectItem>
                        <SelectItem value="ensayo">Ensayo</SelectItem>
                        <SelectItem value="poesia">Poesía</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="academico">Académico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium text-foreground">
                      Año de Publicación
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="1967"
                      {...register("year", { valueAsNumber: true })}
                      data-testid="input-year"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Breve descripción del contenido del documento..."
                    {...register("description")}
                    className="resize-none"
                    data-testid="textarea-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-medium text-foreground">
                    Palabras Clave
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="realismo mágico, literatura latinoamericana, novela"
                    {...register("keywords")}
                    data-testid="input-keywords"
                  />
                  <p className="text-xs text-muted-foreground">Separar con comas</p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6" data-testid="text-file-upload">
                Archivo PDF
              </h3>
              
              <div 
                className="upload-zone rounded-lg p-8 text-center cursor-pointer border-2 border-dashed border-border hover:border-primary hover:bg-muted transition-all"
                onClick={() => fileInputRef.current?.click()}
                data-testid="zone-file-upload"
              >
                <div className="space-y-4">
                  <CloudUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium text-foreground" data-testid="text-upload-instruction">
                      {selectedFile ? selectedFile.name : "Arrastra tu archivo PDF aquí"}
                    </p>
                    <p className="text-muted-foreground" data-testid="text-upload-alternative">
                      o haz clic para seleccionar
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p data-testid="text-supported-formats">Formatos soportados: PDF</p>
                    <p data-testid="text-max-size">Tamaño máximo: 50MB</p>
                  </div>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  data-testid="input-file"
                />
              </div>

              {uploadDocumentMutation.isPending && (
                <div className="mt-6" data-testid="upload-progress">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Subiendo archivo...</span>
                      <span className="text-muted-foreground">Procesando...</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300 w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSubmit(onSubmit)}
                className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                disabled={uploadDocumentMutation.isPending || !selectedFile}
                data-testid="button-publish-document"
              >
                {uploadDocumentMutation.isPending ? (
                  "Publicando..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Publicar Documento
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
