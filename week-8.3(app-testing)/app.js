export async function fetchUser(id) {
  // API call or get data from db
  return new Promise((res, rej) => {
    setTimeout(
      res({
        id: 1,
        name: "rahul",
        age: 29,
        created_at: new Date(),
        updated_at: new Date(),
      }),
      1000
    );
  });
}

function greet(name) {
  return `Hello ${name}`;
}

function greetInSpanish(name) {
  return `Hola ${name}`;
}

// Dependency Injection
// process order
async function processOrder(card, amount, paymentfn) {
  // some logic ...
  // call the the process payment
  const res = await paymentfn(card, amount);
  return res;
}

// process payment
async function processPayment(card, amount) {
  console.log("I am original");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: 123,
        amount,
        card,
      });
    }, 1000);
  });
}
export { greet, greetInSpanish, processOrder, processPayment };
