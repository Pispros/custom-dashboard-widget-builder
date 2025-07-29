import { Image, X } from "lucide-react";
import type { WidgetProps } from "../TextWidgetComponent/textWidget.component";

const ImageWidget = ({
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
    if (confirmation) {
      onDelete(id);
    }
  };

  return (
    <article
      key={id}
      className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:shadow-md transition-all relative group"
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
        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
          <Image className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>

      <div className="bg-white rounded overflow-hidden h-[calc(100%-56px)]">
        <img src={source} alt={title} className="w-full h-full object-cover" />
      </div>
    </article>
  );
};

export default ImageWidget;
