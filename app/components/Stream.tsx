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
    <div className={cn('flex w-full flex-col md:flex md:w-1/2', className)}>
      <div className="flex items-center border-[#5788FA]/50 border-b p-2">
        Total transactions: {useTransactionCount({
          address: AGENT_WALLET_ADDRESS,
          query: { refetchInterval: 5000 },
        }).data}
      </div>
      <div className="max-w-full flex-grow overflow-y-auto p-4 pb-20">
        <p className="text-zinc-500">Streaming real-time...</p>
        <div className="mt-4 space-y-2" role="log" aria-live="polite">
          {streamEntries.map((entry, index) => (
            <StreamItem
              key={`${entry.timestamp.toDateString()}-${index}`}
              entry={entry}
            />
          ))}
        </div>
        <div className="mt-3" ref={bottomRef} />
      </div>
      <div className="p-4">
        <button
          onClick={() => setShouldFetch((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {shouldFetch ? 'Stop Observing' : 'Start Observing'}
        </button>
      </div>
    </div>
  );
}
