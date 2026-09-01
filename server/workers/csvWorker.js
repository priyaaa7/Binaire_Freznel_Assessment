import { parentPort, workerData } from "node:worker_threads";

/*

  [
    [1, 2, 3],
    [4, 5, 6]
  ]
*/
const { rows } = workerData;

let partialSum = 0;

// Go through every row.

for (const row of rows) {
  /*
    Go through every number inside that row.
  */
  for (const number of row) {
    partialSum += number;
  }
}

/*
  Send the partial result back to main thread.
*/
parentPort.postMessage({
  partialSum,

  processedRows: rows.length,
});
