#!/bin/bash

# This script demonstrates working with arrays.

# Define an array.
my_array=(1 2 3 4 5)
echo "----------------_ Arrays in Bash _----------------"

# Print all elements.
echo "My array: ${my_array[@]}"

# Access elements by index (starts at 0).
echo "First element: ${my_array[0]}"

# Get the length of the array.
echo "Length of array: ${#my_array[@]}"
echo

languages=("Python" "JavaScript" "Go")

# Loop through array elements by value.
echo "Looping through array elements:"
for ele in "${languages[@]}"; do
    echo "$ele"
done
echo

# Loop through array elements by index.
echo "Looping through array using index:"
# '${!languages[@]}' expands to the array indices (0 1 2 ...).
for i in "${!languages[@]}"; do
    echo "Index: $i, Value: ${languages[i]}"
done
