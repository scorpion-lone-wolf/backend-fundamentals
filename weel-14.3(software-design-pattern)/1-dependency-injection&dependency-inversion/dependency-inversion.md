# Dependency Inversion Principle (DIP)

## What is Dependency Inversion Principle?

**Dependency Inversion Principle (DIP)** is one of the five **SOLID** principles of Object-Oriented Design.

It states:

> **High-level modules should not depend on low-level modules.**
> Both should depend on **abstractions** (interfaces or abstract classes).
> **Abstractions should not depend on details.** Details should depend on abstractions.

In simple words:
Instead of high-level classes depending directly on concrete low-level classes, they should depend on **interfaces**.

---

## Real-life Analogy

Think of a **Remote Control**:

- **Without DIP**: Your remote only works with one specific TV brand (tight coupling).
- **With DIP**: Your remote works with **any** TV that follows a standard interface (like HDMI or Smart TV protocol). The remote depends on the "interface", not on a specific TV.

---

## Why do we follow DIP?

1. **Reduces Tight Coupling**
   High-level code is not tied to specific implementations.

2. **Increases Flexibility**
   You can easily swap implementations (e.g., switch from Email to SMS).

3. **Improves Maintainability**
   Changes in low-level modules don’t break high-level modules.

4. **Easier Testing**
   You can use mock/fake implementations during unit testing.

5. **Better Code Extensibility**
   Follows Open-Closed Principle — open for extension, closed for modification.

---

## Simple Example (JavaScript)

**❌Without DIP (Bad Practice):**

```typescript
class UserService {
  // High-level module
  constructor() {
    this.emailService = new EmailService(); // Directly depends on concrete class
  }

  sendWelcomeEmail(user) {
    this.emailService.send(user.email, "Welcome!");
  }
}
```

**✅DIP (Good Practice):**

```typescript
// Abstraction (Interface)
interface IEmailService {
  send(to: string, message: string): void;
}

// High-level module depends on abstraction
class UserService {
  constructor(private emailService: IEmailService) {}

  sendWelcomeEmail(user) {
    this.emailService.send(user.email, "Welcome!");
  }
}

// Low-level module implements the abstraction
class EmailService implements IEmailService {
  send(to: string, message: string) {
    console.log(`Email sent to ${to}: ${message}`);
  }
}

// Usage
const emailService = new EmailService();
const userService = new UserService(emailService);
```

## Relationship Between DI and DIP

**Dependency Injection complements Dependency Inversion Principle.**

| Concept                  | Type          | What it is                                                                         | Relationship                    |
| ------------------------ | ------------- | ---------------------------------------------------------------------------------- | ------------------------------- |
| **Dependency Inversion** | **Principle** | High-level modules should depend on abstractions, not concrete classes (SOLID - D) | The **goal** / Rule             |
| **Dependency Injection** | **Technique** | Passing dependencies from outside (via constructor, setter, etc.)                  | The **way** to achieve the goal |

**Key Point**:
You use **Dependency Injection** as a technique to achieve **Dependency Inversion Principle**.
