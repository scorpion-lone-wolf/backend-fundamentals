# File Storage System (S3 Clone) with Tus

## Server Setup

- Create a server that can handle file uploads and store them
- Use Tus protocol for resumable uploads

## Tus Implementation

- Implement endpoints for create, patch (upload chunks), and head (get upload status)
- Keep track of partial uploads so the client can resume if interrupted

## Client Uploader

- Use an existing Tus client library or write your own minimal code if you prefer
- Let users select large files
- Show progress and allow pausing/resuming

## File Retrieval

- Provide a simple way to download or list uploaded files (optional but recommended)

## Verification

- Try uploading a large file, pause in the middle, and resume later
- Check that the final file is correctly stored

## Deliverables

- A server that accepts resumable file uploads via Tus
- A client script or page that can upload files in chunks and resume after disruption
