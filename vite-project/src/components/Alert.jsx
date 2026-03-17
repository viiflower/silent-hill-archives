export default function Alert({ message, type = "error" }) {
  const styles = type === "error" 
    ? "border-red-900 bg-red-950/10 text-red-600" 
    : "border-gray-500 bg-white/5 text-gray-400";

  return (
    <div className={`border-l-4 p-3 my-4 animate-pulse ${styles}`}>
      <p className="text-[10px] tracking-[0.2em] uppercase font-bold">
        {type === "error" ? "!! WARNING: " : ">> SYSTEM: "} {message}
      </p>
    </div>
  );
}