import { useCallback, useEffect, useState } from 'react';
import { AGENT_NAME } from '../constants';
import StreamSvg from '../svg/StreamSvg';
import WalletSvg from '../svg/WalletSvg';
import { formatDateToBangkokTime } from '../utils';

type NavbarProps = {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileChatOpen: (isOpen: boolean) => void;
  isMobileChatOpen: boolean;
};

export default function Navbar({
  setIsMobileMenuOpen,
  isMobileMenuOpen,
  isMobileChatOpen,
  setIsMobileChatOpen,
}: NavbarProps) {
  const [isLiveDotVisible, setIsLiveDotVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // enables glowing live on sepolia dot
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setIsLiveDotVisible((prev) => !prev);
    }, 1000);

    return () => clearInterval(dotInterval);
  }, []);

  const handleMobileProfileClick = useCallback(() => {
    if (!isMobileMenuOpen && isMobileChatOpen) {
      setIsMobileChatOpen(false);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [
    isMobileMenuOpen,
    isMobileChatOpen,
    setIsMobileChatOpen,
    setIsMobileMenuOpen,
  ]);

  const handleMobileChatClick = useCallback(() => {
    if (!isMobileChatOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsMobileChatOpen(!isMobileChatOpen);
  }, [
    isMobileMenuOpen,
    isMobileChatOpen,
    setIsMobileChatOpen,
    setIsMobileMenuOpen,
  ]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="z-10 flex flex-col items-center justify-between border-[#5788FA]/50 border-b bg-black">
      {/* Sección móvil: para que el agente tenga su momento de fama en pantallas pequeñas */}
      <div className="flex w-full items-center justify-between border-[#5788FA]/50 border-b p-2 md:hidden">
        <button type="button" onClick={handleMobileProfileClick}>
          <WalletSvg /> {/* Porque ¿quién no ama un ícono de billetera? */}
        </button>
        <h2 className="font-bold text-[#5788FA] text-xl">{AGENT_NAME}</h2> {/* El nombre del agente: con estilo y confianza */}
        <button type="button" onClick={handleMobileChatClick}>
          <StreamSvg /> {/* Porque el streaming nunca se detiene */}
        </button>
      </div>
  
      {/* Sección principal: donde ocurre la magia */}
      <div className="flex w-full justify-between p-2">
        <div className="flex items-center gap-4">
          {/* Estado de "Live": porque necesitamos un puntito verde para mostrar que estamos vivos */}
          <div className="flex items-center space-x-2">
            <button
              className="mr-2 hidden md:flex lg:hidden"
              onClick={handleMobileProfileClick}
              type="button"
            >
              ☰ {/* Porque el menú de hamburguesa es el rey del UX */}
            </button>
            <div
              className={`h-2 w-2 rounded-full transition-all duration-700 ease-in-out ${
                isLiveDotVisible
                  ? 'bg-green-500 opacity-100' // ¡En vivo y a todo color!
                  : 'bg-green-500 opacity-40' // Todavía vivo, pero con baja energía
              }`}
            />
            <span className="text-xs text-zinc-50 sm:text-sm">
              Live on Base Sepolia {/* Donde todo sucede, o al menos eso creemos */}
            </span>
          </div>
  
          {/* Reloj elegante: porque necesitamos saber qué hora es en Bangkok */}
          <div
            className="hidden text-xs text-zinc-400 sm:text-sm md:flex"
            aria-live="polite"
          >
            {formatDateToBangkokTime(new Date())} ICT {/* La hora del agente, porque Bangkok es el centro del universo */}
          </div>
        </div>
  
        {/* Créditos y enlaces útiles: para los que realmente leen esto */}

      </div>
    </div>
  );
  
}
