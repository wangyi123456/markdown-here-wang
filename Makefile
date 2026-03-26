DIST_DIR = dist
UTILS_DIR = utils

.PHONY: all clean build

build: | clean
	cd $(UTILS_DIR); \
	node "build.js";

clean:
	rm -rf $(DIST_DIR)

all: clean build
