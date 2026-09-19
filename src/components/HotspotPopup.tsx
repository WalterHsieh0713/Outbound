interface HotspotPopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function HotspotPopup({ title, onClose, children }: HotspotPopupProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-lg sm:absolute sm:inset-x-auto sm:top-0 sm:right-0 sm:bottom-0 sm:max-h-none sm:w-80 sm:rounded-2xl sm:rounded-tr-none sm:border-l">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          ✕
        </button>
      </div>
      <div className="mt-3 text-sm text-slate-600">{children}</div>
    </div>
  );
}
