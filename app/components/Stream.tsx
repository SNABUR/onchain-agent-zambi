import { cn } from '@coinbase/onchainkit/theme';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTransactionCount } from 'wagmi';
import { AGENT_WALLET_ADDRESS, DEFAULT_PROMPT } from '../constants';
import useChat from '../hooks/useChat';
import type { AgentMessage, StreamEntry } from '../types';
import { markdownToPlainText } from '../utils';
import StreamItem from './StreamItem';

type StreamProps = {
  className?: string;
};

export default function Stream({ className }: StreamProps) {
  const [streamEntries, setStreamEntries] = useState<StreamEntry[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSuccess = useCallback((messages: AgentMessage[]) => {
    const message = messages.find((res) => res.event === 'agent');
    if (!message) return;

    const streamEntry: StreamEntry = {
      timestamp: new Date(),
      content: markdownToPlainText(message.data || ''),
      type: 'agent',
    };

    setStreamEntries((prev) => [...prev, streamEntry]);
  }, []);

  const { postChat, isLoading } = useChat({
    onSuccess: handleSuccess,
  });

  // Solicita una sola vez al cargar
  useEffect(() => {
    postChat(DEFAULT_PROMPT);
  }, [postChat]);

  // Control de observación manual
  useEffect(() => {
    if (shouldFetch && !isLoading) {
      postChat(DEFAULT_PROMPT);
    }
  }, [shouldFetch, isLoading, postChat]);

  // Autoscroll al fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamEntries]);

  return (
    <div
      className={cn(
        'flex w-full flex-col md:flex md:w-1/2 bg-gradient-to-b from-[#1E1E2F] to-[#121212] rounded-lg shadow-md',
        className,
      )}
    >
      {/* Header con total de transacciones */}
      <div className="flex items-center justify-between border-[#5788FA]/50 border-b p-4">
        <h2 className="text-lg font-bold text-[#5788FA]">
          Agent Dashboard
        </h2>
        <span className="text-sm text-gray-400">
          Total Transactions:{' '}
          <span className="font-semibold text-white">
            {useTransactionCount({
              address: AGENT_WALLET_ADDRESS,
              query: { refetchInterval: 5000 },
            }).data || 'Loading...'}
          </span>
        </span>
      </div>
  
      {/* Streaming de datos */}
      <div className="flex-grow overflow-y-auto p-4 pb-20 text-white">
        <p className="text-sm italic text-[#5788FA]">
          Streaming real-time...
        </p>
        <div className="mt-4 space-y-4" role="log" aria-live="polite">
          {streamEntries.map((entry, index) => (
            <StreamItem
              key={`${entry.timestamp.toDateString()}-${index}`}
              entry={entry}
            />
          ))}
        </div>
        <div className="mt-3" ref={bottomRef} />
      </div>
  
      {/* Footer con botón interactivo */}
      <div className="flex justify-center p-4 bg-[#1A1A27] rounded-b-lg">
        <button
          onClick={() => setShouldFetch((prev) => !prev)}
          className={`px-6 py-2 font-bold text-white transition-all rounded-full shadow-md ${
            shouldFetch
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#5788FA] hover:bg-[#3D7BFF]'
          }`}
        >
          {shouldFetch ? 'Stop Observing' : 'Start Observing'}
        </button>
      </div>
    </div>
  );
  
}
