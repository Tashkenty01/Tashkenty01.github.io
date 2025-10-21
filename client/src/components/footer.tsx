import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="text-primary h-6 w-6" />
              <span className="text-lg font-bold text-foreground" data-testid="text-footer-title">
                Biblioteca Digital
              </span>
            </div>
            <p className="text-muted-foreground mb-4" data-testid="text-footer-description">
              Plataforma colaborativa para el intercambio de conocimiento a través de documentos digitales. 
              Fomentamos la educación y la cultura mediante el acceso libre a la literatura.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-useful-links">
              Enlaces Útiles
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-how-to-upload">
                  Cómo subir documentos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-supported-formats">
                  Formatos soportados
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-user-guide">
                  Guía de usuario
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-usage-policies">
                  Políticas de uso
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-support">
              Soporte
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-help-center">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-report-problem">
                  Reportar problema
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground" data-testid="text-copyright">
            &copy; 2024 Biblioteca Digital. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
