import { useState } from 'react';
import type { Address } from 'viem';
import useGetNFTs from '../hooks/useGetNFTs';
import useGetTokens from '../hooks/useGetTokens';
import AgentAssets from './AgentAssets';
import AgentProfile from './AgentProfile';
import Chat from './Chat';
import Navbar from './Navbar';
import Stream from './Stream';
import LoginButton  from './LoginButton'; // Importa el botón de conexión

export default function Agent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const [nfts, setNFTs] = useState<Address[]>([]);
  const [tokens, setTokens] = useState<Address[]>([]);

  const { getTokens } = useGetTokens({ onSuccess: setTokens });
  const { getNFTs } = useGetNFTs({ onSuccess: setNFTs });

  return (
<div className="relative flex h-screen flex-col overflow-hidden bg-black font-mono text-[#5788FA]">
  {/* Navbar: porque incluso los agentes necesitan navegación */}
  <Navbar
    isMobileMenuOpen={isMobileMenuOpen} // Estado crítico de la "hamburguesa"
    setIsMobileMenuOpen={setIsMobileMenuOpen} // Abrir o cerrar: ¡decisiones importantes!
    isMobileChatOpen={isMobileChatOpen} // Porque los chats también merecen atención
    setIsMobileChatOpen={setIsMobileChatOpen} // El control absoluto del caos
  />
  
  <div className="absolute top-4 right-4 z-10">
        <LoginButton />
      </div>

  {/* La máquina de productividad: dividida en módulos esenciales */}
  <div className="relative flex flex-grow overflow-hidden">
    {/* Sidebar: donde la magia del perfil y activos sucede */}
    <div
      className={`
        ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full' // Oh, sí. Una animación dramática.
        } fixed z-20 flex h-full w-full flex-col overflow-y-auto bg-black transition-transform duration-300 lg:relative lg:z-0 lg:w-1/3 lg:translate-x-0 lg:border-[#5788FA]/50 lg:border-r `}
    >
      <AgentProfile /> {/* Porque el agente merece su propio escaparate */}
      <AgentAssets
        getTokens={getTokens} // Tokens: esas cosas que aún estamos intentando explicar
        getNFTs={getNFTs} // NFTs: porque ¿por qué no?
        tokens={tokens} // Mostrar la colección del agente como si fueran cromos raros
        nfts={nfts} // Fotos digitales que probablemente nadie pidió
      />
    </div>

    {/* Donde el agente escucha, responde y quizá se cansa */}
    <div className="flex w-full lg:w-2/3">
      <Chat
        getTokens={getTokens} // Más tokens. Porque los necesitamos para TODO.
        getNFTs={getNFTs} // Y claro, los NFTs también tienen su lugar.
      />
      <Stream className="hidden" /> {/* ¿Observando en silencio? Más o menos */}
    </div>

    {/* Chat móvil: porque necesitamos encajar TODO en pantallas pequeñas */}
    <div
      className={`
        ${
          isMobileChatOpen ? 'translate-y-0' : 'translate-x-full' // Más transiciones dramáticas
        } fixed top-0 z-8 flex h-full w-full flex-col overflow-y-auto bg-black pt-[100px] transition-transform duration-300 md:hidden`}
    >
      <Stream className="flex w-full flex-col" /> {/* Aquí pasa todo. O nada. */}
    </div>
  </div>
</div>

  );
}
