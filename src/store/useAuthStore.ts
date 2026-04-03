import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    // User authentication
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;

    // Admin authentication
    isAdminAuthenticated: boolean;
    admin: any | null;
    adminToken: string | null;

    hasSeenKycPrompt: boolean;

    // User methods
    login: (userData: any, token: string) => void;
    logout: () => void;
    updateUser: (userData: any) => void;

    // Admin methods
    loginAsAdmin: (adminData: any, token: string) => void;
    logoutAdmin: () => void;

    setHasSeenKycPrompt: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // User state
            isAuthenticated: false,
            user: null,
            token: null,

            // Admin state
            isAdminAuthenticated: false,
            admin: null,
            adminToken: null,

            hasSeenKycPrompt: false,

            // User methods
            login: (userData, token) =>
                set({
                    isAuthenticated: true,
                    user: userData,
                    token,
                }),
            logout: () =>
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    hasSeenKycPrompt: false,
                }),


            updateUser: (userData) =>
                set((state) => ({
                    user: {
                        ...state.user,
                        ...userData,
                        kyc: userData.kyc
                            ? { ...state.user?.kyc, ...userData.kyc }
                            : state.user?.kyc
                    },
                })),

            // Admin methods
            loginAsAdmin: (adminData, token) =>
                set({
                    isAdminAuthenticated: true,
                    admin: adminData,
                    adminToken: token,
                }),

            logoutAdmin: () => {
                sessionStorage.removeItem('adminToken');
                set({
                    isAdminAuthenticated: false,
                    admin: null,
                    adminToken: null,
                });
            },

            setHasSeenKycPrompt: (value) => set({ hasSeenKycPrompt: value }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

