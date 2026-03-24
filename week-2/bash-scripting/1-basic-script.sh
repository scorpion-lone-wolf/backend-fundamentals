#!/bin/bash

# A basic script to demonstrate printing, variables, and user input.

# 1. Printing text to the console.
echo "Hello World! Welcome to bash scripting."
echo

# 2. Using variables to store data.
echo "----------------_ Variables in bash _----------------"
name="Alice"
echo "My name is $name." # Use '$' to access variable values.
echo

# 3. Reading input from the user.
echo "----------------_ User Input _----------------"
echo "Please enter your name:"
read user_name # 'read' command stores user input into a variable.
echo "Hello, $user_name! Nice to meet you."
