import { cn } from '@coinbase/onchainkit/theme';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useChat from '../hooks/useChat';
import type { AgentMessage, StreamEntry } from '../types';
import { generateUUID, markdownToPlainText } from '../utils';
import ChatInput from './ChatInput';
import StreamItem from './StreamItem';

type ChatProps = {
  className?: string;
  getNFTs: () => void;
  getTokens: () => void;
};

export default function Chat({ className, getNFTs, getTokens }: ChatProps) {
  const [userInput, setUserInput] = useState('');
  const [streamEntries, setStreamEntries] = useState<StreamEntry[]>([]);
  const conversationId = useMemo(() => {
    return generateUUID();
  }, []);

  const [shouldRefetchNFTs, setShouldRefetchNFTs] = useState(false);
  const [shouldRefetchTokens, setShouldRefetchTokens] = useState(false);

  useEffect(() => {
    if (shouldRefetchNFTs) {
      getNFTs();
      setShouldRefetchNFTs(false);
    }
  }, [getNFTs, shouldRefetchNFTs]);

  useEffect(() => {
    if (shouldRefetchTokens) {
      getTokens();
      setShouldRefetchTokens(false);
    }
  }, [getTokens, shouldRefetchTokens]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSuccess = useCallback((messages: AgentMessage[]) => {
    const functions =
      messages?.find((msg) => msg.event === 'tools')?.functions || [];
    if (functions?.includes('deploy_nft')) {
      setShouldRefetchNFTs(true);
    }
    if (functions?.includes('deploy_token')) {
      setShouldRefetchTokens(true);
    }

    let message = messages.find((res) => res.event === 'agent');
    if (!message) {
      message = messages.find((res) => res.event === 'tools');
    }
    if (!message) {
      message = messages.find((res) => res.event === 'error');
    }
    const streamEntry: StreamEntry = {
      timestamp: new Date(),
      content: markdownToPlainText(message?.data || ''),
      type: 'agent',
    };
    setStreamEntries((prev) => [...prev, streamEntry]);
  }, []);

  const { postChat, isLoading } = useChat({
    onSuccess: handleSuccess,
    conversationId,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userInput.trim()) {
        return;
      }

      setUserInput('');

      const userMessage: StreamEntry = {
        timestamp: new Date(),
        type: 'user',
        content: userInput.trim(),
      };

      setStreamEntries((prev) => [...prev, userMessage]);

      postChat(userInput);
    },
    [postChat, userInput],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Dependency is required
  useEffect(() => {
    // scrolls to the bottom of the chat when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamEntries]);

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col border-[#5788FA]/50 md:flex md:w-1/2 md:border-r',
        className, // Porque el estilo importa, incluso en la depresión del frontend
      )}
    >
      {/* La sección donde fingimos que sabemos lo que el usuario está pensando */}
      <div className="flex grow flex-col overflow-y-auto p-4 pb-20">
        <p className="text-zinc-500">
          What&apos;s on your mind... {/* Spoiler: probablemente pizza */}
        </p>
        <div className="mt-4 space-y-2" role="log" aria-live="polite">
          {/* Aquí iteramos sobre el "streamEntries" porque sí, el usuario necesita ver cada palabra */}
          {streamEntries.map((entry, index) => (
            <StreamItem
              key={`${entry.timestamp.toDateString()}-${index}`} // Las claves son la única razón por la que React no nos odia
              entry={entry} // Lo que sea que esté aquí, seguro parece importante
            />
          ))}
        </div>
  
        {/* Este div vacío es el héroe silencioso que asegura que todo se vea bien */}
        <div className="mt-3" ref={bottomRef} />
      </div>
  
      {/* Porque incluso los bots necesitan que les escriban */}
      <ChatInput
        userInput={userInput} // Lo que el usuario intenta decir mientras sus gatos caminan por el teclado
        handleKeyPress={handleKeyPress} // Porque los enter accidental son reales
        handleSubmit={handleSubmit} // Donde la magia (o los errores) realmente suceden
        setUserInput={setUserInput} // Probablemente un "hahaha" o un emoji que el backend no soporta
        disabled={isLoading} // Lo desactivamos cuando estamos demasiado ocupados fingiendo que trabajamos
      />
    </div>
  );
  
}
