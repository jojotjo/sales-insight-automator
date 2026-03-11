const XLSX = require("xlsx");

function parseFile(file) {
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (!rows || rows.length === 0) {
    throw new Error("The uploaded file appears to be empty or unreadable.");
  }

  const headers = Object.keys(rows[0]).join(" | ");
  const body = rows.map((row) => Object.values(row).join(" | ")).join("\n");

  return `${headers}\n${body}`;
}

module.exports = { parseFile };