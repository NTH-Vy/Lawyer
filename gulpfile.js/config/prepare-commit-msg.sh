#!/bin/bash

flag="$(git rev-parse --git-dir)/LINT_STAGED"

if [ ! -e "$flag" ]; then
  echo "$(cat "$1") [lint skipped]" > "$1"
fi

rm -f "$flag"
