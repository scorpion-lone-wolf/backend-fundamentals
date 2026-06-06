import { Order } from "./app.js";
class Payment {
  constructor(orderObject) {
    // this.orderId = orderId;
    // this.amout = amount;
    this.order = orderObject;
  }
  proceedPayment() {
    console.log("Payment done");
    console.log("Now Placing Order");
    // const order = new Order(this.orderId, this.amout); // This dependency is tightly coupled with the proceedPayment function.
    this.order.placeOrder();
  }
}
const payment = new Payment(new Order("123,", 250));
payment.proceedPayment();
