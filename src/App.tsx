import React, { useEffect, useState } from "react";
import { openDB, DBSchema } from "idb";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import VisitorTable from "./components/Visitor/Table";
import VisitorModal from "./components/Visitor/Modal";

interface VisitorDB extends DBSchema {
  visitors: {
    key: number;
    value: Visitor;
    indexes: {
      "by-name": string;
      "by-status": string;
    };
  };
}

export interface Visitor {
  id?: number;
  name: string;
  purpose: string;
  contact: string;
  checkInTime: Date;
  checkOutTime: Date | null;
}

const App: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await openDB<VisitorDB>("visitor-management-system", 1, {
          upgrade(db) {
            const visitorStore = db.createObjectStore("visitors", {
              keyPath: "id",
              autoIncrement: true,
            });
            visitorStore.createIndex("by-name", "name");
            visitorStore.createIndex("by-status", "checkOutTime");
          },
        });

        const storedVisitors = await db.getAll("visitors");
        setVisitors(storedVisitors);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const resetDatabase = async () => {
    try {
      const db = await openDB<VisitorDB>("visitor-management-system", 1);
      await db.clear("visitors");
      setVisitors([]);
      console.log("Database reset successfully.");
    } catch (error) {
      console.error("Failed to reset database:", error);
    }
  };

  const addVisitor = async (
    visitor: Omit<Visitor, "id" | "checkInTime" | "checkOutTime">,
  ) => {
    try {
      const db = await openDB<VisitorDB>("visitor-management-system", 1);
      const newVisitor: Visitor = {
        ...visitor,
        checkInTime: new Date(),
        checkOutTime: null,
      };

      const id = await db.add("visitors", newVisitor);
      const addedVisitor = await db.get("visitors", id);

      if (addedVisitor) {
        setVisitors([...visitors, addedVisitor]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add visitor:", error);
    }
  };

  const checkOutVisitor = async (id: number) => {
    try {
      const db = await openDB<VisitorDB>("visitor-management-system", 1);
      const visitor = await db.get("visitors", id);

      if (visitor) {
        const updatedVisitor = {
          ...visitor,
          checkOutTime: new Date(),
        };

        await db.put("visitors", updatedVisitor);

        setVisitors(visitors.map((v) => (v.id === id ? updatedVisitor : v)));
      }
    } catch (error) {
      console.error("Failed to check out visitor:", error);
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Visitor List", 14, 15);

    const tableColumn = ["Name", "Purpose", "Contact", "Check-In", "Check-Out"];
    const tableRows: string[][] = [];

    visitors.forEach((visitor) => {
      const row = [
        visitor.name,
        visitor.purpose,
        visitor.contact,
        new Date(visitor.checkInTime).toLocaleString(),
        visitor.checkOutTime
          ? new Date(visitor.checkOutTime).toLocaleString()
          : "N/A",
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 0,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        lineWidth: 0.1,
        lineColor: [50, 50, 50],
      },
    });

    doc.save("visitor-list.pdf");
  };

  // Filter and Sort Logic
  const filteredVisitors = visitors
    .filter((visitor) =>
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return (
          new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
        );
      } else if (sortOrder === "oldest") {
        return (
          new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime()
        );
      } else {
        return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex justify-between items-center p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          Visitor Management
        </h1>
        <div className="flex gap-4">
          <button
            onClick={exportAsPDF}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Export as PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Add Visitor
          </button>
          <button
            onClick={resetDatabase}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Reset Data
          </button>
        </div>
      </div>

      <div className="p-6 flex gap-4 justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-black"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-lg shadow-sm text-black"
        >
          <option value="latest">Sort by Latest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <VisitorTable
          visitors={filteredVisitors}
          onCheckOut={checkOutVisitor}
        />
      </div>

      {isModalOpen && (
        <VisitorModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={addVisitor}
        />
      )}
    </div>
  );
};

export default App;
