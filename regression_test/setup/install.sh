#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
sh "$root/setup/run.sh" setup/setup.mjs install
sh "$root/setup/run.sh" regression_test/cli.mjs doctor
