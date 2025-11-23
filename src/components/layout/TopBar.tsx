// ============================================
// CareSync • TopBar.tsx
// Fixed top bar with ☰ CareSync trigger
// ============================================

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 px-5 flex items-center backdrop-blur-xl bg-white/5 border-b border-white/10 z-40">
      <button
        onClick={onMenuClick}
        className="flex items-center gap-3 text-sky-300 hover:text-sky-400 transition"
      >
        <span className="text-2xl leading-none">☰</span>
        <span className="text-lg font-semibold tracking-wide bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
          CareSync
        </span>
      </button>
    </header>
  );
};

export default TopBar;
