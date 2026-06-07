import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import { useChatStore } from '../stores/chatStore';
import {chatService} from "../services/chatService";
import type {Message} from "../types/chat";

export function useChat() {
    const queryClient = useQueryClient();
    const {activeConversationId,appendStreamChunk,clearStream} = useChatStore();
    const messages = useQuery({
        queryKey:['messages', activeConversationId],
        queryFn : () => chatService.getMessages(activeConversationId!),
        enabled:!!activeConversationId,
    })
    const sendMessage = useMutation({
        mutationFn: async (content:string)=> {},
        onMutate : async (content) => {
            const optimistic: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
            }
            queryClient.setQueryData(['messages', activeConversationId], ((old: Message[] = []) => [...old,optimistic]))
        }
    })
    const stopStream = () => {
        clearStream();
    }
    return {
        messages : messages.data ?? [],
        isLoading: messages.isLoading,
        sendMessage: (content : string) => sendMessage.mutate(content),
        isStreaming: false,
        stopStream
    }
}
