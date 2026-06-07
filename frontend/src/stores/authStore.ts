import {create} from "zustand"; 
import {persist} from "zustand/middleware";
import type { User } from "../types/auth";
interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User | null, token: string | null) => void;
    logout: () => void;
}
export const useAuthStore = create<AuthState>()(
    persist(
        (set)=> ({
            user:null,
            token:null,
            setAuth:(user,token)=>set({user,token}),
            logout:()=>set({user:null,token:null}),
        }),
        {name:'auth-storage'}
    )
)