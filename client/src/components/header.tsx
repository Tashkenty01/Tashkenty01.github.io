import { BookOpen, UserPlus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="text-primary text-2xl" data-testid="logo-icon" />
              <h1 className="text-xl font-bold text-foreground" data-testid="site-title">Biblioteca Digital</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => scrollToSection('catalogo')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-catalog"
              >
                Catálogo
              </button>
              <button 
                onClick={() => scrollToSection('subir')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-upload"
              >
                Subir Libro
              </button>
              <button 
                onClick={() => scrollToSection('usuarios')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-users"
              >
                Usuarios
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => scrollToSection('registro')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-register"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Registrarse
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
