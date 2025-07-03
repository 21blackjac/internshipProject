// src/utils/exportUtils.js
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports data to Excel file
 * @param {Array<Object>} data - The data to export
 * @param {string} [filename="transactions.xlsx"] - Output filename
 */
export const exportToExcel = (data, filename = "transactions.xlsx") => {
  try {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, filename);
  } catch (error) {
    console.error("Excel export error:", error);
    throw error;
  }
};

/**
 * Exports data to PDF file
 * @param {Array<Object>} data - The data to export
 * @param {string} [filename="transactions.pdf"] - Output filename
 */
export const exportToPDF = (data, filename = "transactions.pdf") => {
  try {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    const doc = new jsPDF();
    const columns = Object.keys(data[0]);
    const rows = data.map((row) => columns.map((col) => row[col]));

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: {
        cellPadding: 4,
        fontSize: 9,
        textColor: [50, 50, 50],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10 },
    });

    doc.save(filename);
  } catch (error) {
    console.error("PDF export error:", error);
    throw error;
  }
};
