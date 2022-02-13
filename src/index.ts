interface FutureValue {
  firstName: string;
  lastName: string;
}

type ResolveFn = (value: FutureValue | PromiseLike<FutureValue>) => void;
type RejectFn = (error: Error) => void;
// type RejectFn = (error: string) => void;

const executorFnWhichResolves = (resolve: ResolveFn): void => {
  /* do something that takes time, and then call resolve */
  setTimeout(() => {
    resolve({ firstName: "Nadia", lastName: "Idris" });
  }, 2000);
};

const executorFnWhichRejects = (_: ResolveFn, reject: RejectFn) => {
  /* do something that takes time, and then call reject */
  setTimeout(() => {
    reject(new Error("this promise failed"));
    // reject("bla bla bla");
  }, 2000);
};

/*
 * Calling functions below
 * */

main1();
// await main2();
// await main3();
// await main4();

/*
 * PROMISES EXAMPLES
 *
 * Simple Promise example using `.then().catch().finally()` to unwrap a Promise.
 * I am not using `async/await`.
 * */
function main1() {
  let startTime = new Date().getTime();

  const promise = new Promise(executorFnWhichResolves);
  promise
    .then((value) => {
      console.log(value);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      let endTime = new Date().getTime();
      const totalTime = (endTime - startTime) / 1000;
      console.log("Total time: ", totalTime);
    });
}

/*
 * Simple Promise example using async/ await and try/catch/finally.
 * */
async function main2() {
  let startTime = new Date().getTime();
  // Comment out one of the Promise creations below:
  const promiseIMade = new Promise(executorFnWhichResolves);
  // const promiseIMade = new Promise(executorFnWhichRejects);

  try {
    const unwrappedPromise = await promiseIMade;
    console.log("Promise got fulfilled:");
    console.log(unwrappedPromise);
  } catch (error) {
    console.log("Promise got rejected: ");
    console.log(error);
  } finally {
    let endTime = new Date().getTime();
    const totalTime = (endTime - startTime) / 1000;
    console.log("Total time: ", totalTime);
  }
}

/*
 * Sequential Promise unwrapping (slow).
 * */
async function main3() {
  let startTime = new Date().getTime();

  for (let i = 0; i < 4; i++) {
    // Comment out one of the Promise creations below:
    const promise = new Promise(executorFnWhichResolves);
    // const promise = new Promise(executorFnWhichRejects);

    try {
      const unwrappedPromise = await promise;
      console.log("Promise got fulfilled:");
      console.log(unwrappedPromise);
    } catch (error) {
      console.log("Promise got rejected: ");
      console.log(error);
    }
  }

  let endTime = new Date().getTime();
  const totalTime = (endTime - startTime) / 1000;
  console.log("Total time: ", totalTime);
}

/*
 * Function below resolves Promises parallel (fast). Some Promises will be fulfilled, some will
 * be rejected.
 * */
async function main4() {
  let startTime = new Date().getTime();

  // Custom Promise Array.
  const promiseArray = [
    new Promise(executorFnWhichResolves),
    new Promise(executorFnWhichRejects),
    new Promise(executorFnWhichResolves),
    new Promise(executorFnWhichRejects),
  ];

  await unWrapPromises(promiseArray);

  let endTime = new Date().getTime();
  const totalTime = (endTime - startTime) / 1000;
  console.log("Total time: ", totalTime);
}

async function unWrapPromises(promisesArray: Promise<FutureValue>[]) {
  const allSettledPromises = await Promise.allSettled(promisesArray);
  // The if statement in the loop is the one checking for successful
  // or rejected Promise completion.
  // We can't use try catch finally blocks here.
  allSettledPromises.forEach((settledPromise) => {
    switch (settledPromise.status) {
      case "fulfilled":
        console.log("OK: ", settledPromise.value);
        break;
      case "rejected":
        console.log("ERROR: ", settledPromise.reason);
        break;
    }
  });
}

export {};
