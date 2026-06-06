/**
 * Simple Factory Pattern example for notifications.
 *
 * This example shows how one class (NotificationFactory) decides which concrete
 * notification class to create. The client code uses the factory instead of
 * creating specific notification objects directly.
 */

// The common interface for all notification types.
interface INotification {
  send(message: string): void;
}

// Concrete implementation for email notifications.
class EmailNotification implements INotification {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

// Concrete implementation for SMS notifications.
class SmsNotification implements INotification {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}

// Concrete implementation for push notifications.
class PushNotification implements INotification {
  send(message: string): void {
    console.log(`Push: ${message}`);
  }
}

/**
 * Factory class: creates the correct notification object based on the requested type.
 * This keeps the client code simple and avoids direct dependency on concrete classes.
 */
class NotificationFactory {
  static create(type: string): INotification {
    switch (type.toLowerCase()) {
      case "email":
        return new EmailNotification();
      case "sms":
        return new SmsNotification();
      case "push":
        return new PushNotification();
      default:
        throw new Error("Invalid notification type");
    }
  }
}

// Example usage: ask the factory for the desired notification type.
const notifier = NotificationFactory.create("email");
notifier.send("Hello from the factory pattern!");
