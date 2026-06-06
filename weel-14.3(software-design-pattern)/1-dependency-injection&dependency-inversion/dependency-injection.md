# Dependency Injection (DI)

## What is Dependency Injection?

**Dependency Injection** is a design pattern/technique where instead of a class or function **creating** its own dependencies, we **pass** (inject) those dependencies from outside.

In simple words:

> Don't create what you need inside the class. Let someone else give it to you.

---

## Real-life Analogy

Imagine you want to make tea:

- **Without DI**: You go to the market yourself, buy milk, sugar, tea leaves, etc.
- **With DI**: Someone else brings all the ingredients to your kitchen. You just focus on making tea.

This makes your "tea-making" class independent and easier to manage.

---

## Why do we use Dependency Injection?

1. **Loosely Coupled Code**
   Classes are not tightly bound to specific implementations. You can easily change or replace dependencies.

2. **Easy Unit Testing**
   You can pass fake (mock) objects during tests. This allows testing individual functions/classes in isolation without side effects.

3. **More Flexible & Maintainable**
   Code becomes easier to modify, extend, and reuse.

4. **Better Code Organization**
   Responsibilities are clearly separated.

---

## Simple Example (JavaScript)

**Without Dependency Injection:**

```javascript
class UserService {
  constructor() {
    this.emailService = new EmailService(); // Hard-coded dependency
  }

  sendWelcomeEmail(user) {
    this.emailService.send(user.email, "Welcome!");
  }
}
```

**Dependency Injection:**

```javascript
class UserService {
  constructor(emailService) {
    // Dependency is injected from outside
    this.emailService = emailService;
  }

  sendWelcomeEmail(user) {
    this.emailService.send(user.email, "Welcome!");
  }
}

// Usage
const emailService = new EmailService();
const userService = new UserService(emailService); // Injecting the dependency
```
