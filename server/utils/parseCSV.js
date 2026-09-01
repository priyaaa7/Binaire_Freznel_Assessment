import fs from "node:fs";
import csv from "csv-parser";

// for converting numeric CSV into a nested array.
// 1,2,3 -> [1,2,3]
export function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const matrix = [];
    let expectedColumns = null;

    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const values = Object.values(row).map((value) => Number(value.trim()));

        if (values.some(Number.isNaN)) {
          reject(new Error("CSV must contain numeric values only."));
          return;
        }

        if (expectedColumns === null) expectedColumns = values.length;
        if (values.length !== expectedColumns) {
          reject(
            new Error("Each row must contain the same number of columns."),
          );
          return;
        }

        matrix.push(values);
      })
      .on("end", () => {
        if (!matrix.length) return reject(new Error("CSV is empty."));
        resolve(matrix);
      })
      .on("error", reject);
  });
}
