import { useState, useEffect } from "react";
import { BarChart3, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WidgetPayload } from "../AddComponent/addWidget.component";
import { getAction } from "../../utils/network.actions";

interface ChartWidgetProps extends WidgetPayload {
  onDelete: (id: string) => void;
}

interface ChartData {
  chartType: string;
  data: Array<{ region: string; revenue: number }>;
  title: string;
  xKey: string;
  yKey: string;
}

const ChartWidget = ({
  id = Date.now().toString(),
  title,
  source,
  width,
  height,
  order,
  onDelete,
}: ChartWidgetProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (source) {
      // Bc of json mock database which restarts the backend after saving the widget
      setTimeout(() => {
        getAction(`data-stream/${source}`)
          .then((response) => {
            if (response.data?.[0].content) {
              setChartData(response.data?.[0].content);
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
      className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 hover:shadow-md transition-all relative group"
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
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>

      <div className="bg-white rounded p-3 h-[calc(100%-56px)]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : chartData ? (
          <>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              {chartData.title}
            </h5>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartData.xKey} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey={chartData.yKey} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
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

export default ChartWidget;
