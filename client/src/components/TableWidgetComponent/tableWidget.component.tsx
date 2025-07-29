import { useState, useEffect } from "react";
import { Table, X } from "lucide-react";
import { getAction } from "../../utils/network.actions";
import type { WidgetPayload } from "../AddComponent/addWidget.component";

interface TableWidgetProps extends WidgetPayload {
  onDelete: (id: string) => void;
}

interface TableData {
  columns: string[];
  rows: Array<Array<string | number>>;
  title: string;
}

const TableWidget = ({
  id = Date.now().toString(),
  title,
  source,
  width,
  height,
  order,
  onDelete,
}: TableWidgetProps) => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (source) {
      // Bc of json mock database which restarts the backend after saving the widget
      setTimeout(() => {
        getAction(`data-stream/${source}`)
          .then((response) => {
            if (response.data?.[0].content) {
              setTableData(response.data?.[0].content);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch table data:", error);
          })
          .finally(() => setLoading(false));
      }, 1500);
    }
  }, [source]);

  const handleDelete = (): void => {
    const confirmation = confirm(
      "Are you sure you want to delete this widget? This action cannot be undone."
    );
    if (confirmation) {
      onDelete(id);
    }
  };

  return (
    <article
      className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 hover:shadow-md transition-all relative group"
      style={{
        height: `${height}px`,
        width: `${width}%`,
        order: order,
      }}>
      <button
        onClick={handleDelete}
        className={`absolute top-2 right-2 p-1.5 rounded transition-all bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white`}>
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
          <Table className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>

      <div className="bg-white rounded p-3 h-[calc(100%-56px)] overflow-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : tableData ? (
          <>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              {tableData.title}
            </h5>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {tableData.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="text-left py-2 px-2 font-medium text-gray-700">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b hover:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="py-2 px-2 text-gray-600 text-left">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-gray-500">No data available</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default TableWidget;
