import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
      <div className="text-center space-y-6">
        <div className="text-6xl opacity-50">🌌</div>
        <h1 className="text-4xl font-serif font-bold text-foreground">
          Página no encontrada
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Te has perdido en el cosmos de la sabiduría
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-gradient-mystic text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Regresar al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
