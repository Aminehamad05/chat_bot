import {create} from 'zustand'

interface ChatState {
    activeConversationId : string |null
    setActiveConversationId: (id: string | null) => void
    streamingContent : string
    appendStreamChunk: (chunk: string) => void
    clearStream: () => void
}
export const useChatStore = create<ChatState>((set)=>({
    activeConversationId:null,
    setActiveConversationId:(id)=>set({activeConversationId:id}),
    streamingContent:'',
    appendStreamChunk:(chunk)=>set((state)=>({streamingContent : state.streamingContent + chunk})),
    clearStream:()=>set({streamingContent:''})
}))