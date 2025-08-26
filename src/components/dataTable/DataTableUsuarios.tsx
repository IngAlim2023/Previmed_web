import React from "react";

export type TableColumn<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  emptyText?: string;
};

export default function DataTableUsuarios<T extends { idUsuario?: string }>({
  data,
  columns,
  emptyText = "Sin datos",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <thead className="bg-blue-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-6 py-3 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider border-b"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={row.idUsuario ?? idx}
                className="even:bg-gray-50 hover:bg-blue-50 transition"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-3 text-sm text-gray-800 border-b"
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
