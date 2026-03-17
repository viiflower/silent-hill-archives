export default function Table({ data, columns }) {
  return (
    <div className="w-full overflow-hidden border border-red-900/20 bg-black/40">
      <table className="w-full text-left text-xs uppercase text-gray-400">
        <thead className="bg-red-900/10 text-red-700">
          <tr>
            {columns.map(col => <th key={col} className="p-3 border-b border-red-900/20">{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
              {Object.values(row).map((val, j) => <td key={j} className="p-3">{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}