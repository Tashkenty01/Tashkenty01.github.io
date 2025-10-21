import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Download, HardDrive, UserPlus, Edit, Trash2, Eye, Filter, FileDown } from "lucide-react";
import type { User, Document } from "@shared/schema";
import PDFPreviewModal from "./pdf-preview-modal";

interface Stats {
  totalUsers: number;
  totalDocuments: number;
  todayDownloads: number;
  storage: string;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      return response.json();
    },
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      novela: "bg-primary/10 text-primary",
      cuento: "bg-accent/10 text-accent-foreground",
      ensayo: "bg-secondary/10 text-secondary-foreground",
      poesia: "bg-primary/10 text-primary",
      tecnico: "bg-accent/10 text-accent-foreground",
      academico: "bg-secondary/10 text-secondary-foreground",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <section id="usuarios" className="py-12 bg-muted/50" data-testid="section-admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-admin-title">
            Panel de Administración
          </h2>
          <p className="text-muted-foreground" data-testid="text-admin-subtitle">
            Gestiona usuarios y contenido de la biblioteca
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-users">
                    {stats?.totalUsers || users.length}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Documentos</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-documents">
                    {stats?.totalDocuments || documents.length}
                  </p>
                </div>
                <div className="bg-accent/10 p-3 rounded-full">
                  <FileText className="text-accent h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Descargas Hoy</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-downloads-today">
                    {stats?.todayDownloads || 452}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Download className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Almacenamiento</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-storage">
                    {stats?.storage || "15.7 GB"}
                  </p>
                </div>
                <div className="bg-accent/10 p-3 rounded-full">
                  <HardDrive className="text-accent h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border">
                <div className="flex justify-between items-center">
                  <CardTitle data-testid="text-registered-users">Usuarios Registrados</CardTitle>
                  <Button size="sm" data-testid="button-new-user">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Fecha Registro</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.slice(0, 10).map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50" data-testid={`row-user-${user.id}`}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="text-primary h-4 w-4" />
                              </div>
                              <span className="font-medium text-foreground" data-testid={`text-username-${user.id}`}>
                                {user.fullName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground" data-testid={`text-email-${user.id}`}>
                            {user.email}
                          </TableCell>
                          <TableCell className="text-muted-foreground" data-testid={`text-registration-date-${user.id}`}>
                            {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" data-testid={`button-edit-user-${user.id}`}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" data-testid={`button-delete-user-${user.id}`}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Panel */}
          <div>
            <Card className="shadow-lg">
              <CardHeader className="border-b border-border">
                <CardTitle data-testid="text-recent-activity">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {documents.slice(0, 5).map((document, index) => (
                  <div key={document.id} className="flex items-start space-x-3" data-testid={`activity-${document.id}`}>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <FileText className="text-primary h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground" data-testid={`activity-description-${document.id}`}>
                        <strong>Usuario</strong> subió "{document.title}"
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`activity-timestamp-${document.id}`}>
                        {document.createdAt ? formatDate(document.createdAt) : 'Recientemente'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Management Table */}
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardHeader className="border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle data-testid="text-document-management">Gestión de Documentos</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" data-testid="button-filter-documents">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-export-documents">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead>Documento</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.slice(0, 10).map((document) => (
                      <TableRow key={document.id} className="hover:bg-muted/50" data-testid={`row-document-${document.id}`}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <FileText className="text-destructive h-5 w-5" />
                            <span className="font-medium text-foreground" data-testid={`text-doc-title-${document.id}`}>
                              {document.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground" data-testid={`text-doc-author-${document.id}`}>
                          {document.author}
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryBadgeColor(document.category)} data-testid={`badge-doc-category-${document.id}`}>
                            {document.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground" data-testid={`text-doc-date-${document.id}`}>
                          {document.createdAt ? formatDate(document.createdAt) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground" data-testid={`text-doc-size-${document.id}`}>
                          {formatFileSize(document.fileSize)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <PDFPreviewModal 
                              document={document}
                              trigger={
                                <Button size="sm" variant="ghost" data-testid={`button-preview-doc-${document.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button size="sm" variant="ghost" data-testid={`button-edit-doc-${document.id}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" data-testid={`button-delete-doc-${document.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
