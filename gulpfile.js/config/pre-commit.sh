#!/bin/sh
npx lint-staged --quiet --relative
if [ $? -eq 0 ]; then
  echo "1" > "$(git rev-parse --git-dir)/LINT_STAGED"
else
  exit 1
fi
