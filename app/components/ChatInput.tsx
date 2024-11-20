import { type ChangeEvent, useCallback } from 'react';
import SendSvg from '../svg/SendSvg';

type PremadeChatInputProps = {
  text: string;
  setUserInput: (input: string) => void;
};

function PremadeChatInput({ text, setUserInput }: PremadeChatInputProps) {
  return (
    <button
      type="submit"
      onClick={() => setUserInput(text)}
      className="w-full whitespace-nowrap rounded-sm border border-[#5788FA]/50 px-2 py-1 text-start text-[#5788FA] transition-colors hover:bg-zinc-900 hover:text-[#3D7BFF] lg:w-auto"
    >
      {text}
    </button>
  );
}

export type ChatInputProps = {
  handleSubmit: (e: React.FormEvent) => void;
  userInput: string;
  setUserInput: (input: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
};

export default function ChatInput({
  handleSubmit,
  userInput,
  setUserInput,
  handleKeyPress,
  disabled = false,
}: ChatInputProps) {
  const handleInputChange = useCallback(
    // TODO: sanitize
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setUserInput(e.target.value);
    },
    [setUserInput],
  );

  return (
    <form
      onSubmit={handleSubmit} // Porque los usuarios todavía creen en el botón "Enviar"
      className="mt-auto flex w-full flex-col border-[#5788FA]/50 border-t bg-black p-4 pb-2 md:mt-0"
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <textarea
            value={userInput} // Aquí almacenamos las dudas existenciales del usuario
            onChange={handleInputChange} // Actualizamos cada pensamiento que se les ocurra
            onKeyPress={handleKeyPress} // Porque siempre hay alguien que insiste en usar Enter
            className="h-24 w-full bg-black p-2 pr-10 text-gray-300 placeholder-[#5788FA] placeholder-opacity-50 lg:h-36"
            placeholder="How can I help?" // Pero, ¿realmente pueden ayudarte?
            rows={1} // Espacio limitado, porque la paciencia también lo es
          />
          <button
            type="submit"
            disabled={!/[a-zA-Z]/.test(userInput)} // No permitimos enviar mensajes vacíos, no estamos aquí para jugar
            className={`mt-auto rounded-sm p-1.5 transition-colors xl:hidden ${
              /[a-zA-Z]/.test(userInput)
                ? 'bg-[#5788FA] text-zinc-950 hover:bg-[#3D7BFF]' // Cuando el usuario tiene algo interesante que decir
                : 'cursor-not-allowed bg-[#5788FA] text-zinc-950 opacity-50' // Cuando simplemente presionan el espacio 50 veces
            }`}
          >
            <SendSvg /> {/* El ícono universal para "Enviar mi sabiduría al mundo" */}
          </button>
        </div>
        <div className="flex w-full items-center justify-between gap-4 py-2">
          <div className="flex grow flex-col flex-wrap gap-2 overflow-x-auto text-xs lg:flex-row lg:text-sm">
            {/* Aquí sugerimos mensajes predeterminados porque a veces escribir es demasiado trabajo */}
            <PremadeChatInput
              setUserInput={setUserInput}
              text="What actions can you take?" // Traducción: "¿Qué hago aquí exactamente?"
            />
            <PremadeChatInput
              setUserInput={setUserInput}
              text="Deploy an NFT" // Por si acaso, desplegar NFTs es lo que todos quieren hacer ahora
            />
          </div>
          <button
            type="submit"
            disabled={!/[a-zA-Z]/.test(userInput) || disabled} // Solo permitimos enviar si han escrito algo coherente
            className={`rounded-sm p-1.5 transition-colors max-xl:hidden ${
              /[a-zA-Z]/.test(userInput) && !disabled
                ? 'bg-[#5788FA] text-zinc-950 hover:bg-[#3D7BFF]' // Botón listo para la acción
                : 'cursor-not-allowed bg-[#5788FA] text-zinc-950 opacity-50' // Botón en modo "no me molestes"
            }`}
          >
            <SendSvg /> {/* Porque enviar con estilo importa */}
          </button>
        </div>
      </div>
    </form>
  );
  
}
