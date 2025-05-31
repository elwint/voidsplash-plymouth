#!/bin/sh
mogrify -strip -define png:compression-level=1 -define png:compression-filter=5 -define png:compression-strategy=1 -define png:exclude-chunk=all frames/*.png
