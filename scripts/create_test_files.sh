#!/bin/bash

# reate_test_files.sh /Users/jerexxypunto/Developer/Kimfe/src/app /Users/jerexxypunto/Developer/Kimfe/__tests__/app

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <src> <dir>"
    exit 1
fi

# Assign arguments to variables
relative_src="$1"
relative_dir="$2"

# Get the absolute paths
src="$(pwd)/$relative_src"
dir="$(pwd)/$relative_dir"

# Check if the src directory exists
if [ ! -d "$src" ]; then
    echo "Error: Source directory '$src' not found."
    exit 1
fi

# Define the tests directory
tests_dir="$dir"

# Check if the tests directory exists
if [ ! -d "$tests_dir" ]; then
    echo "Error: Tests directory '$tests_dir' not found."
    exit 1
fi


# Find all files with the specified extensions recursively within the src directory
find "$src" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) | while read file; do
    # Get the relative path of the file
    relative_path="${file#$src/}"
    
    # Get the directory of the file
    file_dir="$(dirname "$relative_path")"
    
    # Create the corresponding directory in the tests directory if it doesn't exist
    if [ ! -d "$tests_dir/$file_dir" ]; then
        mkdir -p "$tests_dir/$file_dir"
        echo "Created directory: $tests_dir/$file_dir"
    else
        echo "Directory already exists: $tests_dir/$file_dir"
    fi

    # Get the filename without extension
    filename="$(basename "$relative_path" | cut -d. -f1)"
    
    # Define the test file path
    test_file="$tests_dir/$file_dir/${filename}.test.${relative_path##*.}"
    
    # Check if the test file exists
    if [ ! -f "$test_file" ]; then
        touch "$test_file"
        echo "Created test file: $test_file"
    else
        echo "Test file already exists: $test_file"
    fi
done