import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { HeaderMobile } from './HeaderMobile';
import { Toast } from './Toast';

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden selection:bg-gray-900 selection:text-white bg-background">
      <Sidebar />
      
      <main className="flex-1 relative h-full overflow-y-auto overflow-x-hidden bg-background scroll-smooth">
        <HeaderMobile />
        
        <div className="p-4 pb-32 md:p-8 md:pb-12 max-w-7xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>

      <BottomNav />
      <Toast />
    </div>
  );
};
