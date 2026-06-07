/**
 * Chain of Responsibility (CoR) Pattern
 *
 * Purpose: Pass a request through a chain of handlers. Each handler decides
 * whether to process the request or pass it to the next handler in the chain.
 * If no handler processes it, the chain ends.
 *
 * Chain flow:
 * AuthHandler -> InventoryHandler -> PaymentHandler -> OrderCreationHandler -> NotificationHandler
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Order = {
  id: string;
  items: string[];
  quantity: number[];
  paymentSuccessful: boolean;
  totalPrice: number;
  isNotified: boolean;
};

// ============================================================================
// ABSTRACT HANDLER CLASS (Base for all handlers in the chain)
// ============================================================================

abstract class OrderHandler {
  private nextHandler?: OrderHandler;

  // Set the next handler in the chain and return it for chaining.
  setNextHandler(handler: OrderHandler): OrderHandler {
    this.nextHandler = handler;
    return handler;
  }

  // Pass the request to the next handler (if it exists).
  protected next(order: Order): void {
    this.nextHandler?.handle(order);
  }

  // Abstract method each concrete handler must implement.
  abstract handle(order: Order): void;
}

// ============================================================================
// CONCRETE HANDLERS (Each handler processes a specific responsibility)
// ============================================================================

// Handler 1: Authenticate the user before processing the order.
class AuthHandler extends OrderHandler {
  handle(order: Order): void {
    console.log("🔐 Checking user authentication...");

    if (!order.id) {
      console.log("❌ User is NOT authenticated. Order rejected.");
      return; // Stop the chain
    }

    console.log("✅ User is authenticated.");
    this.next(order); // Pass to next handler
  }
}

// Handler 2: Check if inventory is available for the ordered items.
class InventoryHandler extends OrderHandler {
  handle(order: Order): void {
    console.log("📦 Checking inventory availability...");

    const inventoryAvailable = true; // Simulate inventory check
    if (!inventoryAvailable) {
      console.log("❌ Inventory is NOT available. Order rejected.");
      return; // Stop the chain
    }

    console.log("✅ Inventory is available.");
    this.next(order); // Pass to next handler
  }
}

// Handler 3: Process the payment for the order.
class PaymentHandler extends OrderHandler {
  handle(order: Order): void {
    console.log("💳 Processing payment...");

    if (!order.paymentSuccessful) {
      console.log("❌ Payment failed. Order rejected.");
      return; // Stop the chain
    }

    console.log("✅ Payment successful.");
    this.next(order); // Pass to next handler
  }
}

// Handler 4: Create the order in the system after all checks pass.
class OrderCreationHandler extends OrderHandler {
  handle(order: Order): void {
    console.log("📝 Creating order in the system...");
    console.log(`✅ Order ${order.id} created successfully.`);
    this.next(order); // Pass to next handler
  }
}

// Handler 5: Notify the user that the order has been placed.
class NotificationHandler extends OrderHandler {
  handle(order: Order): void {
    console.log("📧 Sending notification to user...");
    order.isNotified = true;
    console.log("✅ User notified about order placement.");
    this.next(order); // Pass to next handler (if any)
  }
}

// ============================================================================
// USAGE / CLIENT CODE
// ============================================================================

// Create an order object.
const order: Order = {
  id: "uid_123",
  items: ["iPhone", "Tablet"],
  quantity: [1, 1],
  paymentSuccessful: true,
  totalPrice: 150000,
  isNotified: false,
};

console.log("Starting order processing chain...\n");

// Create handler instances.
const authHandler = new AuthHandler();
const inventoryHandler = new InventoryHandler();
const paymentHandler = new PaymentHandler();
const orderCreationHandler = new OrderCreationHandler();
const notificationHandler = new NotificationHandler();

// Build the chain: each handler points to the next.
authHandler
  .setNextHandler(inventoryHandler)
  .setNextHandler(paymentHandler)
  .setNextHandler(orderCreationHandler)
  .setNextHandler(notificationHandler);

// Start the chain by calling handle on the first handler.
authHandler.handle(order);

console.log("\n✅ Order processing complete.");
