import { getApiBaseUrl } from "@/lib/api";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Client stub for wedding planning chatbot.
 * Wire to POST /api/v1/ai/chat once the backend route ships.
 */
export function chatbotEndpoint(): string {
  return `${getApiBaseUrl()}/api/v1/ai/chat`;
}

export async function sendChatMessageStub(message: string): Promise<ChatMessage> {
  return {
    role: "assistant",
    content: `[offline stub] Backend chat not connected yet. You said: ${message.slice(0, 160)}`,
  };
}
