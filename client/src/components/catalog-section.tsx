import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Download, Eye, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import type { Document } from "@shared/schema";
import PDFPreviewModal from "./pdf-preview-modal";

export default function CatalogSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 8;

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents", { search: searchQuery, category: selectedCategory }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      
      const response = await fetch(`/api/documents?${params}`);
      if (!response.ok) throw new Error("Failed to fetch documents");
      return response.json();
    },
  });

  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = documents.slice(startIndex, startIndex + documentsPerPage);

  const handleDownload = async (documentId: string, title: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
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

  if (isLoading) {
    return (
      <section id="catalogo" className="py-12" data-testid="section-catalog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-3 mb-2"></div>
                <div className="bg-muted rounded h-8"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-12" data-testid="section-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-catalog-title">
              Catálogo de Documentos
            </h2>
            <p className="text-muted-foreground" data-testid="text-catalog-subtitle">
              Explora nuestra colección de libros y documentos
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full sm:w-80"
                data-testid="input-search"
              />
            </div>
            
            <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)} data-testid="select-category-filter">
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="novela">Novelas</SelectItem>
                <SelectItem value="cuento">Cuentos</SelectItem>
                <SelectItem value="ensayo">Ensayos</SelectItem>
                <SelectItem value="poesia">Poesía</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="academico">Académico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books Grid */}
        {documents.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron documentos</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory ? "Intenta ajustar tus filtros de búsqueda." : "Aún no hay documentos en la biblioteca."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-documents">
              {paginatedDocuments.map((document) => (
                <Card key={document.id} className="libro-card shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1" data-testid={`card-document-${document.id}`}>
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2" data-testid={`text-title-${document.id}`}>
                      {document.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1" data-testid={`text-author-${document.id}`}>
                      {document.author}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <Badge className={getCategoryBadgeColor(document.category)} data-testid={`badge-category-${document.id}`}>
                        {document.category}
                      </Badge>
                      {document.year && (
                        <span data-testid={`text-year-${document.id}`}>{document.year}</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(document.id, document.title)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid={`button-download-${document.id}`}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Descargar
                      </Button>
                      <PDFPreviewModal document={document} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12" data-testid="pagination">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        data-testid={`button-page-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
