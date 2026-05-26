import {api} from "./api";
import type {Conversation, Message} from "../types/chat";

export const chatService = {
    getConversations: () => api.get<Conversation[]>("/conversations").then(res => res.data),
    getMessages:(conversationId:string)=>api.get<Message[]>(`/conversations/${conversationId}/messages`).then((r)=>r.data),
    createConversation:()=>api.post("/conversations",{}).then((r)=>r.data),
}