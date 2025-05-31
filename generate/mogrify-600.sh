#!/bin/sh
# Smaller size to increase plymouth load time
mogrify -resize 600x600 -strip -define png:compression-level=1 -define png:compression-filter=5 -define png:compression-strategy=1 -define png:exclude-chunk=all frames/*.png
