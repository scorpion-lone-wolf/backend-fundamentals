/**
 * Dependency Injection (DI) and Dependency Inversion Principle (DIP) example
 *
 * Dependency Injection (DI):
 * - A technique for providing an object's dependencies from the outside instead of
 *   the object creating them itself. Improves testability and decoupling.
 *
 * Dependency Inversion Principle (DIP) (SOLID):
 * - High-level modules should not depend on low-level modules. Both should depend on
 *   abstractions.
 * - Abstractions should not depend on details. Details should depend on abstractions.
 *
 * How this file demonstrates DIP + DI:
 * - `IPayment` is the abstraction (interface).
 * - `PaymentProcessor` is a high-level module that depends only on `IPayment`.
 * - `StripePayment`, `RazorpayPayment`, `TestPayment` are low-level modules that
 *   implement `IPayment` (they depend on the abstraction).
 * - A concrete provider is injected into `PaymentProcessor` at runtime (method injection
 *   shown below), so `PaymentProcessor` never directly depends on concrete classes.
 */

// Abstraction: high-level code depends on this interface, not concrete details.
interface IPayment {
  pay(amount: number): void;
}

// Low-level module: concrete implementation for Stripe.
class StripePayment implements IPayment {
  pay(amount: number): void {
    console.log(`Payment successful through Stripe: ₹${amount}`);
  }
}

// Low-level module: concrete implementation for Razorpay.
class RazorpayPayment implements IPayment {
  pay(amount: number): void {
    console.log(`Payment successful through Razorpay: ₹${amount}`);
  }
}

// High-level module: PaymentProcessor depends only on the IPayment abstraction.
// The concrete provider is injected via the method parameter (method injection).
class PaymentProcessor {
  proceedPayment(amount: number, paymentProvider: IPayment): boolean {
    // The processor does not know or care which provider is used.
    paymentProvider.pay(amount);
    return true;
  }
}

// --- Usage examples ---
const paymentProcessor = new PaymentProcessor();

// Method (runtime) injection: pick provider at runtime and inject into the call.
const selectedProvider = "razorpay"; // could come from config/user input

if (selectedProvider === "razorpay") {
  paymentProcessor.proceedPayment(2000, new RazorpayPayment());
} else if (selectedProvider === "stripe") {
  paymentProcessor.proceedPayment(2000, new StripePayment());
}

// Test/dummy implementation for unit tests or development (no external calls).
class TestPayment implements IPayment {
  pay(amount: number): void {
    console.log(`Test payment executed for amount: ₹${amount}`);
  }
}

// Example test call — useful in tests or local development.
paymentProcessor.proceedPayment(2000, new TestPayment());

/*
Alternative: Constructor injection example (uncomment to use):

class PaymentProcessorWithConstructor {
  constructor(private paymentProvider: IPayment) {}

  proceedPayment(amount: number): boolean {
    this.paymentProvider.pay(amount);
    return true;
  }
}

// Usage with constructor injection:
// const processor = new PaymentProcessorWithConstructor(new StripePayment());
// processor.proceedPayment(1000);
*/
