import type {
  LayoutOption,
  WidgetCreationType,
} from "../pages/DashboardBuilder/dashboardBuilder.page";
import {
  FileText,
  Image,
  Table,
  BarChart3,
  LayoutGrid,
  Columns3,
  Grid3x3,
} from "lucide-react";
export const widgetTypes: WidgetCreationType[] = [
  {
    id: "custom-text",
    type: "custom-text",
    name: "Custom Text",
    description: "Add custom text content",
    icon: FileText,
    bgColor: "bg-blue-100",
    iconBgColor: "bg-blue-500",
    borderColor: "border-blue-300",
  },
  {
    id: "image",
    type: "image",
    name: "Image Widget",
    description: "Display images and media",
    icon: Image,
    bgColor: "bg-green-50",
    iconBgColor: "bg-green-500",
    borderColor: "border-green-300",
  },
  {
    id: "data-table",
    type: "data-table",
    name: "Data Table",
    description: "Display tabular data",
    icon: Table,
    bgColor: "bg-purple-50",
    iconBgColor: "bg-purple-500",
    borderColor: "border-purple-300",
  },
  {
    id: "chart",
    type: "chart",
    name: "Chart Widget",
    description: "Create graphs and charts",
    icon: BarChart3,
    bgColor: "bg-orange-50",
    iconBgColor: "bg-orange-500",
    borderColor: "border-orange-300",
  },
];

export const layoutOptions: LayoutOption[] = [
  { id: "full", name: "Full Width", icon: LayoutGrid, cols: 1 },
  { id: "2-columns", name: "2 Columns", icon: Columns3, cols: 2 },
  { id: "3-columns", name: "3 Columns", icon: Grid3x3, cols: 3 },
  { id: "grid", name: "Grid", icon: Grid3x3, cols: "grid" },
];
