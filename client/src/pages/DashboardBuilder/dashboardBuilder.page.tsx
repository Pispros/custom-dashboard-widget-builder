import React, { useEffect, useState } from "react";
import type { DragEvent } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import AddWidget, {
  type WidgetPayload,
} from "../../components/AddComponent/addWidget.component";
import { deleteAction, postAction } from "../../utils/network.actions";
import TextWidget from "../../components/TextWidgetComponent/textWidget.component";
import ImageWidget from "../../components/ImageWidgetComponent/imageWidget.component";
import TableWidget from "../../components/TableWidgetComponent/tableWidget.component";
import ChartWidget from "../../components/ChartWidgetComponent/chartWidget.component";
import { useFetch } from "../../hooks/useFetch.hook";
import { layoutOptions, widgetTypes } from "../../data/data";

export type WidgetCreationType = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconBgColor: string;
  borderColor: string;
  type: WidgetPayload["type"];
};

export interface LayoutOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  cols: number | "grid";
}

type LayoutType = "full" | "2-columns" | "3-columns" | "grid";

const DashboardBuilder = () => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("full");
  const [widgets, setWidgets] = useState<WidgetPayload[]>([]);
  const [isWidgetModalOpened, setIsWidgetModalOpened] = useState(false);
  const [selectedWidgetToAdd, setSelectedWidgetToAdd] =
    useState<WidgetCreationType | null>(null);

  const { response: savedWidgets, isLoading } = useFetch<{
    data: WidgetPayload[];
  }>("widgets");

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    widgetType: WidgetCreationType
  ): void => {
    e.dataTransfer.setData("widgetType", JSON.stringify(widgetType));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    const widgetTypeData: string = e.dataTransfer.getData("widgetType");
    const widgetType: WidgetCreationType = JSON.parse(widgetTypeData);
    setSelectedWidgetToAdd(widgetType);
    setIsWidgetModalOpened(true);
  };

  const handleLayoutChange = (layoutId: string): void => {
    //setSelectedLayout(layoutId as LayoutType);
    console.log(layoutId);
    setSelectedLayout("full" as LayoutType); // Defaulting to full for now
  };

  const handleSubmittedWidget = async (widget: WidgetPayload) => {
    try {
      const payload = { ...widget, id: Date.now().toString() };
      await postAction("widgets", payload);
      setWidgets([...widgets, { ...payload }]);
      setIsWidgetModalOpened(false);
    } catch (error) {
      console.log(error);
      alert("Failed to add widget. Please try again later.");
    }
  };

  const handleDeleteWidget = async (id: string) => {
    try {
      console.log("Widget submitted:", id);
      await deleteAction(`widgets/${id}`);
      setWidgets(widgets.filter((widget) => widget.id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete widget. Please try again later.");
    }
  };

  const renderAWidget = (widget: WidgetPayload) => {
    switch (widget.type) {
      case "custom-text":
        return <TextWidget {...widget} onDelete={handleDeleteWidget} />;
      case "image":
        return <ImageWidget {...widget} onDelete={handleDeleteWidget} />;
      case "data-table":
        return <TableWidget {...widget} onDelete={handleDeleteWidget} />;
      case "chart":
        return <ChartWidget {...widget} onDelete={handleDeleteWidget} />;

      default:
        break;
    }
  };

  const getGridClassName = (layout: LayoutType): string => {
    switch (layout) {
      case "full":
        return "grid-cols-1";
      case "2-columns":
        return "grid-cols-2";
      case "3-columns":
        return "grid-cols-3";
      case "grid":
        return "grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  const renderLayoutPreview = (layoutId: string) => {
    switch (layoutId) {
      case "full":
        return <div className="w-12 h-8 bg-gray-300 rounded"></div>;
      case "2-columns":
        return (
          <div className="flex space-x-1">
            <div className="w-5 h-8 bg-gray-300 rounded"></div>
            <div className="w-5 h-8 bg-gray-300 rounded"></div>
          </div>
        );
      case "3-columns":
        return (
          <div className="flex space-x-1">
            <div className="w-3.5 h-8 bg-gray-300 rounded"></div>
            <div className="w-3.5 h-8 bg-gray-300 rounded"></div>
            <div className="w-3.5 h-8 bg-gray-300 rounded"></div>
          </div>
        );
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className="w-5 h-3.5 bg-gray-300 rounded"></div>
            <div className="w-5 h-3.5 bg-gray-300 rounded"></div>
            <div className="w-5 h-3.5 bg-gray-300 rounded"></div>
            <div className="w-5 h-3.5 bg-gray-300 rounded"></div>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  useEffect(() => {
    if (savedWidgets && savedWidgets?.data && !!savedWidgets?.data?.length) {
      setWidgets(savedWidgets?.data);
    }
  }, [savedWidgets]);

  return (
    <div className="w-[calc(100vw)] bg-gray-100">
      {selectedWidgetToAdd !== null && (
        <AddWidget
          isOpen={isWidgetModalOpened}
          onClose={() => setIsWidgetModalOpened(false)}
          onSubmit={handleSubmittedWidget}
          widgetType={selectedWidgetToAdd}
        />
      )}
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-medium text-gray-800">
              Dashboard Builder
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-400 rounded-full">
              <img
                className="w-8 h-8 bg-gray-400 rounded-full"
                src="https://i.pravatar.cc/300"
                alt=""
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-sm overflow-y-auto">
          <div className="p-5">
            {/* Widget Library */}
            <section className="mb-6">
              <h2 className="text-xl text-left font-bold text-gray-700 mb-3">
                Widget Library
              </h2>
              <div className="space-y-2.5">
                {widgetTypes.map((widget: WidgetCreationType) => (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={(e: DragEvent<HTMLDivElement>) =>
                      handleDragStart(e, widget)
                    }
                    className={`${widget.bgColor} border-2 border-dashed ${widget.borderColor} rounded-lg p-3 cursor-move hover:shadow-sm transition-all`}>
                    <div className="flex items-start space-x-2.5">
                      <div
                        className={`w-9 h-9 ${widget.iconBgColor} rounded-md flex items-center justify-center flex-shrink-0`}>
                        <widget.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800">
                          {widget.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Options */}
            <section>
              <h2 className="text-xl text-left font-bold text-gray-700 mb-3">
                Layout Options
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {layoutOptions.map((layout: LayoutOption) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => handleLayoutChange(layout.id)}
                    className={`p-3 rounded-md border transition-all ${
                      selectedLayout === layout.id
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}>
                    <div className="flex flex-col items-center">
                      {renderLayoutPreview(layout.id)}
                      <p
                        className={`text-xs mt-2 ${
                          selectedLayout === layout.id
                            ? "text-blue-600 font-medium"
                            : "text-gray-600"
                        }`}>
                        {layout.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm h-full border border-gray-200">
            <div className="px-6 py-4">
              <h2 className="text-lg text-left font-medium text-gray-800">
                My Dashboard
              </h2>
              <p className="text-sm text-left text-gray-500 mt-0.5">
                Drag widgets from the sidebar to create your custom dashboard
              </p>
            </div>

            <div
              className="px-6 pb-6 h-[calc(100%-88px)] overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={handleDrop}>
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading widgets...</p>
                </div>
              )}
              {widgets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-700 mb-1">
                    Start Building Your Dashboard
                  </h3>
                  <p className="text-sm text-gray-500">
                    Drag and drop widgets from the sidebar to get started
                  </p>
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${getGridClassName(selectedLayout)}`}>
                  <div className="h-full py-5 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Drag and drop new widgets from the sidebar to continue
                    </p>
                  </div>
                  <div
                    className="flex gap-4 justify-between"
                    style={{ flexFlow: "row wrap" }}>
                    {widgets
                      .sort((a, b) => b.order - a.order)
                      .map((widget: WidgetPayload) => (
                        <>{renderAWidget(widget)}</>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardBuilder;
