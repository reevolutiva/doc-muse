#!/bin/bash
find ../../../ -name "*.tsx" -type f -exec grep -l "Document Templates\|Project Templates" {} \;
