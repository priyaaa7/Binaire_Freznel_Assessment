import { Worker } from "node:worker_threads";

const workerUrl = new URL("../workers/csvWorker.js", import.meta.url);

export function runWorkerForChunk(rows) {
  return new Promise((resolve, reject) => {
    // Create worker and send chunk as workerData.
    const worker = new Worker(workerUrl, {
      workerData: {
        rows,
      },
    });

    /*
      worker successfully sends result.
    */
    worker.once("message", (result) => {
      resolve(result);
    });

    // for error

    worker.once("error", (error) => {
      reject(error);
    });

    /*
      Check worker exit.

      Code 0 = normal exit.
    */
    worker.once("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
