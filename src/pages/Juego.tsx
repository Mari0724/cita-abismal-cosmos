import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { apiService } from '../services/api';
import type { Frase } from '../types';
import { cn } from '@/lib/utils';

interface OpcionRespuesta {
  autor: string;
  correcta: boolean;
}

export default function Juego() {
  const [frase, setFrase] = useState<Frase | null>(null);
  const [opciones, setOpciones] = useState<OpcionRespuesta[]>([]);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [puntuacion, setPuntuacion] = useState({ correctas: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const autoresAlternativos = [
    'Oscar Wilde', 'Virginia Woolf', 'Mark Twain', 'Maya Angelou',
    'Pablo Neruda', 'Gabriel García Márquez', 'Jorge Luis Borges',
    'Frida Kahlo', 'Winston Churchill', 'Mahatma Gandhi',
    'Steve Jobs', 'Nelson Mandela', 'Leonardo da Vinci'
  ];

  const cargarNuevaFrase = async () => {
    setIsLoading(true);
    setRespuestaSeleccionada(null);
    setMostrarResultado(false);

    try {
      const nuevaFrase = await apiService.getFraseAleatoria();
      setFrase(nuevaFrase);

      // Crear opciones: una correcta y dos incorrectas
      const opcionesIncorrectas = autoresAlternativos
        .filter(autor => autor !== nuevaFrase.autor)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const todasLasOpciones = [
        { autor: nuevaFrase.autor, correcta: true },
        { autor: opcionesIncorrectas[0], correcta: false },
        { autor: opcionesIncorrectas[1], correcta: false }
      ].sort(() => Math.random() - 0.5);

      setOpciones(todasLasOpciones);
    } catch (error) {
      console.error('Error al cargar frase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const manejarRespuesta = (autorSeleccionado: string) => {
    if (mostrarResultado) return;

    setRespuestaSeleccionada(autorSeleccionado);
    setMostrarResultado(true);

    const opcionSeleccionada = opciones.find(op => op.autor === autorSeleccionado);
    const esCorrecta = opcionSeleccionada?.correcta || false;

    setPuntuacion(prev => ({
      correctas: prev.correctas + (esCorrecta ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const reiniciarJuego = () => {
    setPuntuacion({ correctas: 0, total: 0 });
    cargarNuevaFrase();
  };

  useEffect(() => {
    cargarNuevaFrase();
  }, []);

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

  const porcentajeAciertos = puntuacion.total > 0 
    ? Math.round((puntuacion.correctas / puntuacion.total) * 100) 
    : 0;

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
            <h1 className="text-2xl font-serif font-bold text-mystic-gold">
              Trivia Literaria
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {puntuacion.correctas}/{puntuacion.total} ({porcentajeAciertos}%)
            </div>
            <Button variant="outline" size="sm" onClick={reiniciarJuego}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold mb-4 text-foreground">
            ¿Quién dijo esta frase?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Pon a prueba tu conocimiento sobre grandes pensadores y escritores
          </p>
        </div>

        {isLoading ? (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-gradient-cosmic border-border">
              <div className="animate-pulse space-y-6">
                <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              </div>
            </Card>
          </div>
        ) : frase ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Frase */}
            <Card className="p-8 bg-gradient-cosmic border-border shadow-2xl">
              <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-center mb-6">
                <span className="text-mystic-gold text-3xl">"</span>
                {frase.texto}
                <span className="text-mystic-gold text-3xl">"</span>
              </blockquote>

              <div className="text-center">
                <span className={cn(
                  "inline-block px-3 py-1 rounded-full text-sm font-medium",
                  "bg-muted/30 border border-border",
                  getThemeColor(frase.tema)
                )}>
                  {frase.tema}
                </span>
              </div>
            </Card>

            {/* Opciones */}
            <Card className="p-6 bg-gradient-cosmic border-border">
              <div className="space-y-3">
                {opciones.map((opcion, index) => {
                  const isSelected = respuestaSeleccionada === opcion.autor;
                  const showResult = mostrarResultado;
                  const isCorrect = opcion.correcta;
                  
                  let buttonVariant: "default" | "outline" | "destructive" = "outline";
                  let extraClasses = "";

                  if (showResult && isCorrect) {
                    extraClasses = "border-green-500 bg-green-500/10 text-green-400";
                  } else if (showResult && isSelected && !isCorrect) {
                    extraClasses = "border-destructive bg-destructive/10 text-destructive";
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => manejarRespuesta(opcion.autor)}
                      disabled={mostrarResultado}
                      className={cn(
                        "w-full h-auto p-4 text-left justify-start",
                        "border-border hover:bg-muted/20",
                        "transition-all duration-200",
                        extraClasses
                      )}
                      variant={buttonVariant}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{opcion.autor}</span>
                        {showResult && isCorrect && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>

              {mostrarResultado && (
                <div className="mt-6 text-center space-y-4">
                  <div className={cn(
                    "p-4 rounded-lg",
                    opciones.find(op => op.autor === respuestaSeleccionada)?.correcta
                      ? "bg-green-500/10 text-green-400"
                      : "bg-destructive/10 text-destructive"
                  )}>
                    {opciones.find(op => op.autor === respuestaSeleccionada)?.correcta
                      ? "¡Correcto! 🎉"
                      : `Incorrecto. La respuesta correcta es: ${frase.autor}`
                    }
                  </div>

                  <Button 
                    onClick={cargarNuevaFrase}
                    className="bg-gradient-mystic hover:opacity-90"
                  >
                    Siguiente frase
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  );
}