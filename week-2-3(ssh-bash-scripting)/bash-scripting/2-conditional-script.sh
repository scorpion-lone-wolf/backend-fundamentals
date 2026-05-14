#!/bin/bash

# This script demonstrates conditionals and quoting.

echo "----------------_ Conditional Statements _----------------"
user_name="Rahul"

# An 'if' statement checks a condition.
# Note the required spaces inside the [ ].
if [ "$user_name" == "Alice" ]; then
    echo "Welcome back, Alice!"
else
    echo "Hello, $user_name! Nice to meet you."
fi
echo

echo "----------------_ Single Quotes vs Double Quotes _----------------"
course="Backend Development"

# Double quotes ("") expand variables.
echo "I am learning $course." # Prints: I am learning Backend Development.

# Single quotes ('') do NOT expand variables.
echo 'I am learning $course.' # Prints: I am learning $course.
