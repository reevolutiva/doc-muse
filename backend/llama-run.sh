#!/bin/bash

while getopts f: flag
do
    case "${flag}" in
        f) a=${OPTARG};;
    esac
done

if [ -z "$a" ]; then
    echo "Usage: $0 -f <argument>"
    exit 1
fi

docker exec kimfe-backend python /app/"$a"