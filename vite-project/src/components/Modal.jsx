export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#050505] border border-white/20 p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        {/* Esquinas decorativas neón */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40"></div>
        
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
          <h2 className="text-white tracking-[0.3em] uppercase text-sm font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-900 hover:text-red-500 text-xs tracking-tighter">[ CLOSE_X ]</button>
        </div>

        {children}
      </div>
    </div>
  );
}