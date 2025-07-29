import { useState, useEffect } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { X } from "lucide-react";
import type { WidgetCreationType } from "../../pages/DashboardBuilder/dashboardBuilder.page";

// Type definitions
type FormFieldName = "title" | "type" | "width" | "height" | "order" | "source";
type FormErrors = Partial<Record<FormFieldName, string | number>>;

// Widget form data interface
export type WidgetPayload = {
  id?: string;
  title: string;
  type: "custom-text" | "image" | "data-table" | "chart";
  source: string;
  width: number;
  height: number;
  order: number;
};

// Component props interface
interface AddWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WidgetPayload) => void;
  widgetType: WidgetCreationType;
}

const AddWidget = ({
  isOpen,
  onClose,
  onSubmit,
  widgetType,
}: AddWidgetProps) => {
  // State with explicit types
  const [formData, setFormData] = useState<WidgetPayload>({
    title: "",
    source: "",
    type: widgetType.type,
    width: 47,
    height: 250,
    order: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Effect to update form when widget type changes
  useEffect((): void => {
    if (widgetType) {
      setFormData(
        (prev: WidgetPayload): WidgetPayload => ({
          ...prev,
          type: widgetType.type,
          title: widgetType.name,
        })
      );
    }
  }, [widgetType]);

  // Handle input changes with strict typing
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value }: { name: string; value: string } = e.target;
    const fieldName: FormFieldName = name as FormFieldName;

    setFormData((prev: WidgetPayload): WidgetPayload => {
      const numericFields: FormFieldName[] = ["width", "height", "order"];
      const isNumericField: boolean = numericFields.includes(fieldName);

      return {
        ...prev,
        [fieldName]: isNumericField ? parseInt(value, 10) || 0 : value,
      };
    });

    // Clear error for the field being edited
    if (errors[fieldName] !== undefined) {
      setErrors(
        (prev: FormErrors): FormErrors => ({
          ...prev,
          [fieldName]: undefined,
        })
      );
    }
  };

  // Validation function with strict return type
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    // Width validation
    if (formData.width <= 0 || formData.width > 100) {
      newErrors.width = "Width must be between 1 and 100";
    }

    // Height validation
    if (formData.height <= 0) {
      newErrors.height = "Height must be greater than 0";
    }

    // Order validation
    if (formData.order <= 0) {
      newErrors.order = "Order must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (): void => {
    const isValid: boolean = validateForm();
    if (isValid) {
      onSubmit(formData);
      handleClose();
    }
  };

  // Close handler that resets form
  const handleClose = (): void => {
    const resetFormData: WidgetPayload = {
      title: "",
      source: "",
      type: widgetType.type,
      width: 47,
      height: 250,
      order: 1,
    };

    setFormData(resetFormData);
    setErrors({});
    onClose();
  };

  // Backdrop click handler
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Key press handler for form submission
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Widget type options
  const widgetTypeOptions: Array<{ value: string; label: string }> = [
    { value: "", label: "Select type" },
    { value: "custom-text", label: "Custom Text" },
    { value: "image", label: "Image Widget" },
    { value: "data-table", label: "Data Table" },
    { value: "chart", label: "Chart Widget" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray bg-opacity-50"
        onClick={handleBackdropClick}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onKeyPress={handleKeyPress}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            Add Widget
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm text-left font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter widget title"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Type Select */}
            <div>
              <label
                htmlFor="type"
                className="block text-left text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.type ? "border-red-300" : "border-gray-300"
                }`}
                aria-invalid={!!errors.type}
                aria-describedby={errors.type ? "type-error" : undefined}>
                {widgetTypeOptions.map(
                  (option: { value: string; label: string }) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
              {errors.type && (
                <p id="type-error" className="mt-1 text-sm text-red-600">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Source Identifier Input */}
            <div>
              <label
                htmlFor="source"
                className="block text-sm text-left font-medium text-gray-700 mb-1">
                Content or source stream identifier{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.source ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Content or source (working eg: chart-1, table-1)"
                aria-invalid={!!errors.source}
                aria-describedby={errors.source ? "title-error" : undefined}
              />
              {errors.source && (
                <p id="title-error" className="mt-1 text-sm text-red-600">
                  {errors.source}
                </p>
              )}
            </div>

            {/* Width and Height Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Width Input */}
              <div>
                <label
                  htmlFor="width"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Width (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.width ? "border-red-300" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.width}
                  aria-describedby={errors.width ? "width-error" : undefined}
                />
                {errors.width && (
                  <p id="width-error" className="mt-1 text-sm text-red-600">
                    {errors.width}
                  </p>
                )}
              </div>

              {/* Height Input */}
              <div>
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.height ? "border-red-300" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.height}
                  aria-describedby={errors.height ? "height-error" : undefined}
                />
                {errors.height && (
                  <p id="height-error" className="mt-1 text-sm text-red-600">
                    {errors.height}
                  </p>
                )}
              </div>
            </div>

            {/* Order Input */}
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.order ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Display order"
                aria-invalid={!!errors.order}
                aria-describedby={errors.order ? "order-error" : undefined}
              />
              {errors.order && (
                <p id="order-error" className="mt-1 text-sm text-red-600">
                  {errors.order}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWidget;
