import React, { useState, useEffect } from "react";

interface VisitorModalProps {
  onClose: () => void;
  onSubmit: (visitor: {
    name: string;
    purpose: string;
    contact: string;
  }) => void;
}

const purposes = ["Meeting", "Delivery", "Interview", "Maintenance", "Other"];

const VisitorModal: React.FC<VisitorModalProps> = ({ onClose, onSubmit }) => {
  const [visitorData, setVisitorData] = useState({
    name: "",
    purpose: "",
    contact: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    purpose: "",
    contact: "",
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d*$/.test(value)) return;
    setVisitorData({ ...visitorData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!visitorData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!visitorData.purpose) {
      newErrors.purpose = "Purpose is required";
      isValid = false;
    }

    if (!visitorData.contact.trim()) {
      newErrors.contact = "Contact information is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(visitorData);
      setVisitorData({ name: "", purpose: "", contact: "" });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 shadow-xl bg-opacity-90 z-40 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-100 rounded-lg shadow-2xl ring ring-gray-500 w-full max-w-md mx-4 z-50 animate-fadeIn">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-800">Add Visitor</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={visitorData.name}
              onChange={handleChange}
              className={`text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter visitor's full name"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Purpose of Visit
            </label>
            <select
              id="purpose"
              name="purpose"
              value={visitorData.purpose}
              onChange={handleChange}
              className={`text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.purpose
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            >
              <option value="" disabled>
                Select purpose
              </option>
              {purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
            {errors.purpose && (
              <p className="mt-1 text-red-500 text-xs">{errors.purpose}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Information
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={visitorData.contact}
              onChange={handleChange}
              className={`text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.contact
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter phone number"
            />
            {errors.contact && (
              <p className="mt-1 text-red-500 text-xs">{errors.contact}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-white bg-white hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitorModal;
