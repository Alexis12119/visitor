import React from "react";
import { Visitor } from "../../App";

interface VisitorTableProps {
  visitors: Visitor[];
  onCheckOut: (id: number) => void;
}

const VisitorTable: React.FC<VisitorTableProps> = ({
  visitors,
  onCheckOut,
}) => {
  // Format date to a readable string
  const formatDate = (date: Date | null): string => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="w-full">
      <table className="w-full table-auto border-2 border-gray-500">
        <thead>
          <tr className="bg-gray-300 text-white">
            <th className="border-2 border-gray-700 px-4 py-3 font-semibold text-center text-black">
              Name
            </th>
            <th className="border-2 border-gray-700 px-4 py-3 font-semibold text-center text-black">
              Purpose
            </th>
            <th className="border-2 border-gray-700 px-4 py-3 font-semibold text-center text-black">
              Contact
            </th>
            <th className="border-2 border-gray-700 px-4 py-3 font-semibold text-center text-black">
              Check-In Time
            </th>
            <th className="border-2 border-gray-700 px-4 py-3 font-semibold text-center text-black">
              Check-Out Time
            </th>
            <th className="border-2 border-gray-700 px-4 py-3 text-center font-semibold text-black">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {visitors.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="border-2 border-gray-700 px-4 py-8 text-center text-black"
              >
                No visitors registered yet.
              </td>
            </tr>
          ) : (
            visitors.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-gray-50 text-center text-black">
                <td className="border-2 border-gray-700 px-4 py-3">
                  {visitor.name}
                </td>
                <td className="border-2 border-gray-700 px-4 py-3">
                  {visitor.purpose}
                </td>
                <td className="border-2 border-gray-700 px-4 py-3">
                  {visitor.contact}
                </td>
                <td className="border-2 border-gray-700 px-4 py-3">
                  {formatDate(visitor.checkInTime)}
                </td>
                <td className="border-2 border-gray-700 px-4 py-3">
                  {formatDate(visitor.checkOutTime)}
                </td>
                <td className="border-2 border-gray-700 px-4 py-3 text-center">
                  {visitor.checkOutTime ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      Checked Out
                    </span>
                  ) : (
                    <button
                      onClick={() => visitor.id && onCheckOut(visitor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorTable;
