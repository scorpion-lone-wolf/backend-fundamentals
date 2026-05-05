# Web Performance

## Overview

Web Performance refers to **how fast and efficiently a website loads and executes**. It encompasses both the speed of data delivery and the efficiency of code execution.

### Where Does the Problem Lie?

Performance issues can originate from:

- **Frontend**: Slow rendering, heavy JavaScript, unoptimized assets
- **Backend**: Slow database queries, inefficient algorithms, memory leaks

Since this section focuses on **backend optimization**, we will learn techniques to identify and fix performance bottlenecks in server-side code.

---

## Performance Profiling Techniques

### 1. Manual Logging

**Concept**: Track execution time by logging timestamps at the start and end of code sections.

**How to Use**:

1. Add log statement at the beginning of an API or function
2. Add log statement at the end
3. Calculate the difference to identify which code section is slow
4. Narrow down the problematic code block step by step

**Example**:

```javascript
console.time("API Request");
// ... API code here
console.timeEnd("API Request");
```

---

### 2. CPU Profiling

**What It Is**: CPU Profiling is a performance analysis technique that measures **how the CPU is utilized** during program execution. It identifies which functions, methods, or lines of code consume the most CPU time.

**Key Metrics**:

- CPU idle time (unused CPU)
- CPU active time (running code)
- Time spent in each function

#### CPU Profiling Methods

#### **Method A: Chrome DevTools** (For Frontend Testing)

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform user actions
5. Click Stop to view CPU usage details

#### **Method B: VS Code Debugger** (Node.js Backend)

**Steps**:

1. Open VS Code
2. Click on **Run and Debug** or press `Ctrl+Shift+D`
3. Select **JavaScript Debug Terminal**
4. In the terminal, run:
   ```bash
   node --inspect server.js
   ```
5. VS Code will open the debugging interface
6. In DevTools (that opens), go to the **Profiler** tab
7. Click **Start** to begin CPU profiling
8. Make API requests to the endpoint you want to profile
9. Click **Stop** to end profiling
10. Analyze the generated profile data to see which functions consume most CPU

#### **Method C: Programmatic Profiling** (In Code)

**Steps**:

1. Add `console.profile()` where you want to start profiling:

   ```javascript
   console.profile("ProfileName");
   ```

2. Add `console.profileEnd()` where you want to end:

   ```javascript
   console.profileEnd("ProfileName");
   ```

3. Run in debug mode:

   ```bash
   node --inspect server.js
   ```

4. Open DevTools and call the relevant API endpoint
5. DevTools will show the profiling data with function call times

---

### 3. Heap Profiling

**What It Is**: Heap Profiling tracks **how memory is allocated and used** over time during program execution.

**Why It Matters**:

- Memory allocation is expensive and can slow down your application
- Identifies memory leaks and excessive allocations
- Helps reduce memory footprint for better performance

**When to Use**: When you suspect memory issues are causing performance problems

**How to Use**:

1. Open Node.js in debug mode: `node --inspect server.js`
2. Open DevTools → Memory tab
3. Start recording memory allocation
4. Perform operations (API calls, database queries)
5. Stop recording and analyze memory allocation patterns

---

### 4. Heap Snapshots

**What It Is**: A Heap Snapshot captures a **complete snapshot of all objects and memory** currently allocated in your program at a specific moment in time.

**Why It's Useful**:

- Compare memory state before and after operations
- Identify unreleased objects that cause memory leaks
- Find objects consuming excessive memory

**How to Take Snapshots**:

1. Open Node.js in debug mode: `node --inspect server.js`
2. Open DevTools → Memory tab
3. Click **Take Heap Snapshot**
4. Perform operations (API request, database query)
5. Take another snapshot
6. Compare both snapshots to identify:
   - Objects that weren't garbage collected
   - Memory that grew unexpectedly
   - Potential memory leaks

**Comparison Process**:

- Snapshot A (before operation) vs Snapshot B (after operation)
- If objects remain from operation A when taking snapshot B, they are potential leaks
- Look for large object allocations or unexpected growth

---

## Quick Reference: Choosing the Right Tool

| Issue                             | Tool           | Method                           |
| --------------------------------- | -------------- | -------------------------------- |
| Find which line/function is slow  | Manual Logging | Simple console.time()            |
| Understand CPU usage patterns     | CPU Profiling  | VS Code Debugger or programmatic |
| Memory growing over time          | Heap Profiling | DevTools Memory tab              |
| Memory leaks / unreleased objects | Heap Snapshots | Take before/after snapshots      |

---

## Summary

**Backend performance optimization workflow**:

1. Identify the slow API using Manual Logging
2. Use CPU Profiling to find the bottleneck function
3. Use Heap Profiling to check if memory is the issue
4. Use Heap Snapshots to compare memory before/after
5. Optimize the identified code section
6. Re-profile to confirm improvements
