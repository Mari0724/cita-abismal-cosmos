import { useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useUserStore } from '../store/useUserStore';
import { LoginModal } from './LoginModal';
import type { Frase } from '../types';
import { cn } from '@/lib/utils';

interface FraseCardProps {
  frase: Frase;
  onNuevaFrase: () => void;
  isLoading?: boolean;
}

export function FraseCard({ frase, onNuevaFrase, isLoading }: FraseCardProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { usuario, isLoggedIn, addFavorito } = useUserStore();

  const isFavorita = usuario?.favoritos.includes(frase.id) || false;

  const handleGuardar = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addFavorito(frase.id);
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

  return (
    <>
      <Card className={cn(
        "p-8 bg-gradient-cosmic border-border",
        "backdrop-blur-sm shadow-2xl",
        "max-w-2xl mx-auto transition-all duration-300",
        "hover:shadow-mystic-purple/20 hover:shadow-2xl"
      )}>
        <div className="space-y-6">
          <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-center">
            <span className="text-mystic-gold text-3xl">"</span>
            {frase.texto}
            <span className="text-mystic-gold text-3xl">"</span>
          </blockquote>

          <div className="text-center space-y-2">
            <p className="text-lg font-serif text-mystic-gold">
              — {frase.autor}
            </p>
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-sm font-medium",
              "bg-muted/30 border border-border",
              getThemeColor(frase.tema)
            )}>
              {frase.tema}
            </span>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={onNuevaFrase}
              disabled={isLoading}
              className={cn(
                "bg-muted hover:bg-muted/80 text-foreground",
                "transition-all duration-200",
                isLoading && "opacity-50"
              )}
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
              Otra cita
            </Button>

            <Button
              onClick={handleGuardar}
              variant="outline"
              disabled={isFavorita}
              className={cn(
                "border-mystic-purple text-mystic-purple",
                "hover:bg-mystic-purple hover:text-white",
                "transition-all duration-200",
                isFavorita && "bg-mystic-purple text-white opacity-70"
              )}
            >
              <Heart className={cn("mr-2 h-4 w-4", isFavorita && "fill-current")} />
              {isFavorita ? 'Guardada' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Card>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal} 
      />
    </>
  );
}