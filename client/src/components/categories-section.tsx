import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Feather, GraduationCap, PenTool, Scroll, ServerCog } from "lucide-react";

const categories = [
  {
    name: "Novelas",
    count: "1,234 documentos",
    icon: BookOpen,
    color: "bg-primary/10 text-primary"
  },
  {
    name: "Cuentos",
    count: "892 documentos",
    icon: Feather,
    color: "bg-accent/10 text-accent"
  },
  {
    name: "Académicos",
    count: "567 documentos",
    icon: GraduationCap,
    color: "bg-primary/10 text-primary"
  },
  {
    name: "Poesía",
    count: "345 documentos",
    icon: PenTool,
    color: "bg-accent/10 text-accent"
  },
  {
    name: "Ensayos",
    count: "423 documentos",
    icon: Scroll,
    color: "bg-primary/10 text-primary"
  },
  {
    name: "Técnicos",
    count: "289 documentos",
    icon: ServerCog,
    color: "bg-accent/10 text-accent"
  }
];

export default function CategoriesSection() {
  const handleCategoryClick = (categoryName: string) => {
    // Scroll to catalog section and apply filter
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
      // Note: In a real implementation, this would trigger the filter
      console.log(`Filter by category: ${categoryName}`);
    }
  };

  return (
    <section className="py-12" data-testid="section-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-categories-title">
            Categorías Destacadas
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="text-categories-subtitle">
            Explora por género y temática
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.name}
                className="shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform duration-200"
                onClick={() => handleCategoryClick(category.name)}
                data-testid={`card-category-${category.name.toLowerCase()}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`text-category-name-${category.name.toLowerCase()}`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-category-count-${category.name.toLowerCase()}`}>
                        {category.count}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
