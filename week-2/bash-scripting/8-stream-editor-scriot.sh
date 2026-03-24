# sed = Stream Editor
# sed is a powerful text processing tool that allows you to perform various operations on text files or streams.
# It is commonly used for searching, replacing, and manipulating text in a non-interactive way

#  creating multi line file
cat << EOF > file.txt
Hello World World
Hello World World
Hello World World
Hello World World
Hello World World
EOF

# Replace "World" with "Backend"
sed -i '' 's/World/Backend/' file.txt
# -i flag is used to edit the file in place, meaning that the changes will be saved directly to the file.txt.
# The 's' command is used for substitution, where 'World' is the pattern to search for, 'Backend' is the replacement string
# 'g' flag is used to replace all occurrences of the pattern in each line. If you want to replace only the first occurrence in each line, you can omit the 'g' flag.
