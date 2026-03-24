#!/bin/bash

# This script demonstrates creating files and folders, and moving files.

# --- Creating Files ---
echo "--- Creating a single-line file ---"
# The '>' operator redirects the output of the 'echo' command to a file.
# If the file doesn't exist, it's created. If it exists, it's overwritten.
echo "Welcome to the backend fundamentals course!" > welcome.txt
echo "Created welcome.txt"
echo

# --- Reading File Content ---
echo "--- Reading the content of welcome.txt ---"
# The 'cat' command reads files and prints their content to standard output.
cat welcome.txt
echo
echo

# --- Creating Multi-line Files with a "Here Document" ---
echo "--- Creating a multi-line file ---"
# A "Here Document" (<<EOF) is a way to provide multi-line input to a command.
# 'cat > welcome-multi.txt' redirects the input into the file.
# 'EOF' is a delimiter; the here document ends when this delimiter is found on a new line.
cat > welcome-multi.txt <<EOF
This is the backend fundamentals course. 🚀
You will learn about bash scripting, databases, and more.
This course is designed to help you become a proficient backend developer.
EOF
echo "Created welcome-multi.txt"
echo "--- Reading the content of welcome-multi.txt ---"
cat welcome-multi.txt
echo
echo

# --- Creating Folders and Moving Files ---
echo "--- Creating a folder and moving files ---"
# The 'mkdir' command creates a new directory.
mkdir -p temp # -p flag ensures it doesn't error if the directory already exists
echo "Created 'temp' directory."

# The 'mv' command moves files or directories.
# Here, it moves the two text files into the 'temp' directory.
mv welcome.txt welcome-multi.txt temp/
echo "Moved welcome.txt and welcome-multi.txt into temp/"
echo

# --- Creating Multiple Folders ---
echo "--- Creating multiple folders at once ---"
# You can create multiple directories in one command using brace expansion.
mkdir {folder1,folder2}
echo "Created folder1, and folder2."
