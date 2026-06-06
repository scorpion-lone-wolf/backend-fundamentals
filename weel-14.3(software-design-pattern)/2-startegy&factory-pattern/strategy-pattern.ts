/**
 * Strategy Pattern example for payment processing.
 *
 * The Strategy Pattern lets us define a family of algorithms (payment methods),
 * encapsulate each one in a class, and make them interchangeable.
 * This is useful when the behavior should change at runtime without modifying
 * the client code.
 */

// --- Strategy Interface ------------------------------------------------------
// Defines the contract that all payment strategies must follow.
interface PaymentStrategy {
  pay(amount: number): void;
}

// --- Concrete Strategy Implementations --------------------------------------
// Each class implements a different payment method.
class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ₹${amount} using Credit Card`);
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ₹${amount} using PayPal`);
  }
}

class UpiPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ₹${amount} using UPI`);
  }
}

// --- Context / Client --------------------------------------------------------
// The CheckoutService uses a PaymentStrategy but does not depend on concrete
// payment classes. The chosen strategy can be injected from outside.
class CheckoutService {
  constructor(private paymentStrategy: PaymentStrategy) {}

  checkout(amount: number): void {
    this.paymentStrategy.pay(amount);
  }
}

// --- Usage Examples ----------------------------------------------------------
// Choose a strategy and inject it into the context.
const creditCardPayment = new CreditCardPayment();
const creditCardCheckout = new CheckoutService(creditCardPayment);
creditCardCheckout.checkout(500);

const payPalPayment = new PayPalPayment();
const payPalCheckout = new CheckoutService(payPalPayment);
payPalCheckout.checkout(750);

const upiPayment = new UpiPayment();
const upiCheckout = new CheckoutService(upiPayment);
upiCheckout.checkout(300);

// If you want to switch strategy at runtime, create a new CheckoutService with
// a different payment method.
