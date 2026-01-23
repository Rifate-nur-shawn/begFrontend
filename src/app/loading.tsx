export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="font-utility text-xs tracking-[0.2em] animate-pulse">
          LOADING
        </span>
      </div>
    </div>
  );
}
