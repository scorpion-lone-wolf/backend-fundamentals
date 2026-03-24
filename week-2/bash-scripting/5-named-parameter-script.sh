#!/bin/bash

# This script demonstrates positional parameters and named arguments (flags).

# Positional parameters are accessed by number ($1, $2, etc.).
# $0 is the script's name.
# Example: ./5-named-parameter-script.sh first_arg second_arg
# echo "Script: $0, First: $1, Second: $2"
echo

# Named arguments (flags) are parsed using 'getopts'.
echo "----------------_ Named Arguments (Flags) _----------------"

# 'getopts "u:p:"' defines 'u' and 'p' as valid options.
# The colon ':' means the option requires an argument.
while getopts "u:p:" opt; do
    case $opt in
        u) username=$OPTARG;; # -u flag, argument is stored in $OPTARG
        p) password=$OPTARG;; # -p flag
        *) echo "Invalid flag"; exit 1;; # Handle unknown flags
    esac
done

# After the loop, the variables can be used.
echo "Username: $username"
echo "Password: $password"

# Example: ./5-named-parameter-script.sh -u myuser -p mypass