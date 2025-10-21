import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import PDFViewer from "./pdf-viewer";
import type { Document } from "@shared/schema";

interface PDFPreviewModalProps {
  document: Document;
  trigger?: React.ReactNode;
}

export default function PDFPreviewModal({ document, trigger }: PDFPreviewModalProps) {
  const fileUrl = `/uploads/${document.fileName}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="secondary"
            className="px-3"
            data-testid={`button-preview-${document.id}`}
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] w-full h-full p-0" data-testid="pdf-preview-modal">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold text-foreground" data-testid="modal-title">
            {document.title}
          </DialogTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span data-testid="modal-author">Por: {document.author}</span>
            {document.year && (
              <span data-testid="modal-year">• {document.year}</span>
            )}
            <span data-testid="modal-category">• {document.category}</span>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0" data-testid="modal-pdf-container">
          <PDFViewer 
            fileUrl={fileUrl}
            documentTitle={document.title}
            documentId={document.id}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}