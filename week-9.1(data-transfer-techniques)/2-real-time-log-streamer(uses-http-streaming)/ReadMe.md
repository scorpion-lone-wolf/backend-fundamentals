# Real-Time Log Streamer

## Server Setup

- Create a web server
- Prepare a data source for log messages (could be an array, a file, or generated strings)

## Real-Time Streaming

- Use a method to push new log entries to the client as they appear (Server-Sent Events or a similar approach)
- Keep the connection open so new messages are automatically sent

## Client Viewer

- Build a minimal page that subscribes to the log stream
- Display each new log entry in real time

## Verification

- Ensure logs appear as soon as they are generated
- Confirm that the connection stays active over time

## Deliverables

- A server endpoint that sends new log messages continuously
- A client page that shows each incoming log message right away
