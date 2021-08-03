export function to(promise: Promise<any>, improved?: {}) {
  return promise
    .then((data) => [null, data])
    .catch((error) => {
      if (improved) {
        Object.assign(error, improved);
      }

      return [error];
    });
}
