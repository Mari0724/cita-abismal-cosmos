import React from "react";
import cn from "clsx";

// Importa las imágenes
import GatoNormal from "../assets/gatos/Normal.jpg";
import GatoFeliz from "../assets/gatos/Feliz.jpg";
import GatoConfundido from "../assets/gatos/Confundido.jpg";
import GatoEnojado from "../assets/gatos/Enojado.jpg";

interface Props {
  mood: "normal" | "feliz" | "confundido" | "enojado";
  className?: string;
}

const imageMap: Record<Props["mood"], string> = {
  normal: GatoNormal,
  feliz: GatoFeliz,
  confundido: GatoConfundido,
  enojado: GatoEnojado,
};

export const GatoPresenter = ({ mood, className }: Props) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <img
        src={imageMap[mood]}
        alt={`Gato ${mood}`}
        className="w-40 h-40 object-contain transition-all duration-300 ease-in-out"
      />
    </div>
  );
};
