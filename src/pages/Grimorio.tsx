import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowLeft, Book } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useUserStore } from '../store/useUserStore';
import { apiService } from '../services/api';
import type { Frase } from '../types';
import { cn } from '@/lib/utils';

export default function Grimorio() {
  const [frasesFavoritas, setFrasesFavoritas] = useState<Frase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { usuario, isLoggedIn, removeFavorito } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const cargarFavoritas = async () => {
      if (usuario?.favoritos.length) {
        try {
          const frases = await apiService.getFrasesByIds(usuario.favoritos);
          setFrasesFavoritas(frases);
        } catch (error) {
          console.error('Error al cargar favoritas:', error);
        }
      }
      setIsLoading(false);
    };

    cargarFavoritas();
  }, [isLoggedIn, usuario?.favoritos, navigate]);

  const handleEliminar = (fraseId: number) => {
    removeFavorito(fraseId);
    setFrasesFavoritas(prev => prev.filter(f => f.id !== fraseId));
  };

  const getThemeColor = (tema: string) => {
    const themes = {
      'filosofía': 'text-mystic-purple',
      'literatura': 'text-mystic-indigo',
      'espiritualidad': 'text-mystic-gold',
      'ciencia': 'text-cyan-400',
      'psicología': 'text-purple-400',
      'inspiración': 'text-orange-400'
    };
    return themes[tema as keyof typeof themes] || 'text-muted-foreground';
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/inicio">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-mystic-gold flex items-center">
              <Book className="mr-2 h-6 w-6" />
              Mi Grimorio
            </h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {frasesFavoritas.length} frases guardadas
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-muted-foreground max-w-md mx-auto">
            Aquí están las frases que han tocado tu alma. 
            Tu colección personal de sabiduría.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="p-6 bg-mystic-card border-border">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded w-full"></div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : frasesFavoritas.length === 0 ? (
          <div className="text-center space-y-6">
            <div className="text-6xl opacity-50">📚</div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif text-foreground">
                Tu grimorio está vacío
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Comienza a guardar frases que te inspiren para crear tu propia colección de sabiduría.
              </p>
            </div>
            <Link to="/inicio">
              <Button className="bg-gradient-mystic hover:opacity-90">
                <Heart className="mr-2 h-4 w-4" />
                Explorar frases
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {frasesFavoritas.map((frase) => (
              <Card 
                key={frase.id}
                className={cn(
                  "p-6 bg-gradient-cosmic border-border",
                  "transition-all duration-300 hover:shadow-lg",
                  "hover:shadow-mystic-purple/20"
                )}
              >
                <div className="space-y-4">
                  <blockquote className="text-sm leading-relaxed">
                    <span className="text-mystic-gold">"</span>
                    {frase.texto}
                    <span className="text-mystic-gold">"</span>
                  </blockquote>

                  <div className="space-y-2">
                    <p className="text-sm font-serif text-mystic-gold">
                      — {frase.autor}
                    </p>
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs",
                      "bg-muted/30 border border-border",
                      getThemeColor(frase.tema)
                    )}>
                      {frase.tema}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleEliminar(frase.id)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full border-destructive text-destructive",
                      "hover:bg-destructive hover:text-white",
                      "transition-colors duration-200"
                    )}
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}