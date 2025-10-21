import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  documentTitle: string;
  documentId: string;
}

export default function PDFViewer({ fileUrl, documentTitle, documentId }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);
    setLoading(true);
    setError(null);
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError('Error al cargar el documento PDF');
    setLoading(false);
    console.error('PDF load error:', error);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg" data-testid="pdf-error">
        <div className="text-center">
          <div className="text-destructive mb-2">📄</div>
          <p className="text-destructive font-medium">Error al cargar el PDF</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="pdf-viewer">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card" data-testid="pdf-toolbar">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground px-2" data-testid="page-info">
            {loading ? 'Cargando...' : `${pageNumber} de ${numPages}`}
          </span>
          
          <Button
            size="sm"
            variant="outline"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || loading}
            data-testid="button-next-page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={zoomOut}
            disabled={loading || scale <= 0.5}
            data-testid="button-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground px-2" data-testid="zoom-level">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            size="sm"
            variant="outline"
            onClick={zoomIn}
            disabled={loading || scale >= 3.0}
            data-testid="button-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={rotate}
            disabled={loading}
            data-testid="button-rotate"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="ml-2"
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-muted p-4" data-testid="pdf-content">
        <div className="flex justify-center">
          {loading && (
            <div className="space-y-4" data-testid="pdf-loading">
              <Skeleton className="h-96 w-72" />
              <div className="text-center text-muted-foreground">Cargando documento...</div>
            </div>
          )}
          
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            className="max-w-none"
            data-testid="pdf-document"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              className="shadow-lg border border-border"
              loading={<Skeleton className="h-96 w-72" />}
              error={
                <div className="flex items-center justify-center h-96 w-72 bg-background border border-border rounded">
                  <div className="text-center text-muted-foreground">
                    <div className="mb-2">📄</div>
                    <p>Error al renderizar la página</p>
                  </div>
                </div>
              }
              data-testid="pdf-page"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}