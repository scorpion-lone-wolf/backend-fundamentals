export class Order {
  constructor(orderId, orderAmount) {
    this.orderId = orderId;
    this.orderAmount = orderAmount;
  }
  placeOrder() {
    console.log(
      `The order with orderid ${this.orderId} has been placed with amout ${this.orderAmount}`
    );
  }
}
