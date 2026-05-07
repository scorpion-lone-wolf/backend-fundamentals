# Music Streaming Service (Spotify Clone)

## Server Setup

- Create a small web server (Node.js or any language you prefer)
- Store a few music files on the server

## Streaming Endpoint

- Use partial content (range requests) so the client can stream audio
- Return proper headers for partial playback

## Client Player

- Create a basic frontend page
- Embed an audio element or write your own player logic to play the streamed file

## Verification

- Test that you can pause, seek, and resume playback
- Check network requests to confirm partial file requests are working

## Deliverables

- A working server that streams music files
- A simple HTML page that can play the files
