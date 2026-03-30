#!/bin/bash

# This script demonstrates two types of 'for' loops.

# 1. 'for' loop using brace expansion to create a range.
echo "----------------_ For Loop with range syntax _----------------"
for i in {1..10}; do
    echo "Iteration $i"
done
echo

# 2. C-style 'for' loop.
echo "----------------_ For Loop with Step (C style) _----------------"
# (( initialization; condition; increment ))
for ((i=1; i<=10; i++)); do
    echo "Iteration $i"
done
