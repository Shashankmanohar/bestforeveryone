import { create } from 'zustand';

interface ToastState {
  isVisible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  title: '',
  message: '',
  type: 'success',
  
  showToast: (title, message, type = 'success') => {
    set({ isVisible: true, title, message, type });
    
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },
  
  hideToast: () => set({ isVisible: false })
}));
