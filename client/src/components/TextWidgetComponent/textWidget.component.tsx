import { FileText, X } from "lucide-react";
import type { WidgetPayload } from "../AddComponent/addWidget.component";

export interface WidgetProps extends WidgetPayload {
  onDelete: (id: string) => void;
}

const TextWidget = ({
  id = Date.now().toString(),
  title,
  source,
  width,
  height,
  order,
  onDelete,
}: WidgetProps) => {
  const handleDelete = (): void => {
    const confirmation = confirm(
      "Are you sure you want to delete this widget? This action cannot be undone."
    );
    console.log("confirmation", confirmation);
    if (confirmation) {
      onDelete(id);
    }
  };

  return (
    <article
      className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-all relative group"
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
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-medium text-gray-800 line-clamp-1">{title}</h4>
      </div>

      <div className="bg-white rounded p-3 h-[calc(100%-56px)] overflow-auto text-5xl flex items-center justify-center">
        <p className="text-gray-700 whitespace-pre-wrap line-clamp-1">
          {source}
        </p>
      </div>
    </article>
  );
};

export default TextWidget;
