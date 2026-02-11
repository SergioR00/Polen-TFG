import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';

function Layout() {
    const location = useLocation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Pollen Tracker</h1>
                </div>

                <nav className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-full border border-gray-200">
                    <NavLink to="/" currentPath={location.pathname}>Forecast</NavLink>
                    <NavLink to="/pollutants" currentPath={location.pathname}>Pollutants</NavLink>
                    <NavLink to="/giveFeeling" currentPath={location.pathname}>Feelings</NavLink>
                </nav>

                <div className="flex items-center space-x-3">
                    <button onClick={() => setIsLoginOpen(true)} className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-3 py-2">Login</button>
                    <button onClick={() => setIsRegisterOpen(true)} className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">Register</button>
                </div>
                </div>
            </header>
            <main>
                <Outlet />
            </main>

            {/* MODALS */}
            {isLoginOpen && <Modal title="Welcome Back" onClose={() => setIsLoginOpen(false)}>
                <form className="space-y-4">
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Sign In</button>
                </form>
            </Modal>}

            {isRegisterOpen && <Modal title="Create Account" onClose={() => setIsRegisterOpen(false)}>
                <form className="space-y-4">
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="password" placeholder="Create Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="allergie" placeholder="Your polen allergie" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Get Started</button>
                </form>
            </Modal>}
        </div>
    )
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 className="text-2xl font-black text-gray-800 mb-6">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function NavLink({ to, children, currentPath }: { to: string, children: React.ReactNode, currentPath: string }) {
  const isActive = currentPath === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-bold transition-all duration-200 rounded-full ${
        isActive
          ? 'text-blue-700 bg-blue-100 shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

export default Layout