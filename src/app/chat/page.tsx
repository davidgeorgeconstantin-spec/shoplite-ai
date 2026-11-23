import type { Metadata } from 'next';
import { ChatWindow } from '@/features/chat/ChatWindow';

export const metadata: Metadata = { title: 'Assistant' };

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <ChatWindow />
    </div>
  );
}
