#!/usr/bin/env bash

set -o pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$ROOT_DIR/test-log.log"
TMP_OUTPUT="$(mktemp)"

cleanup() {
	rm -f "$TMP_OUTPUT"
}

trap cleanup EXIT

cd "$ROOT_DIR" || exit 1

STARTED_AT="$(date '+%Y-%m-%d %H:%M:%S')"

{
	echo "========================================"
	echo "Ionic PoC Unit Test Log"
	echo "Started: $STARTED_AT"
	echo "Command: npm run test -- --code-coverage"
	echo "========================================"
	echo
} >"$LOG_FILE"

npm run test -- --code-coverage >"$TMP_OUTPUT" 2>&1 &
TEST_PID=$!

SECONDS_RUNNING=0
SPINNER='|/-\\'
while kill -0 "$TEST_PID" 2>/dev/null; do
	SPINNER_CHAR="${SPINNER:SECONDS_RUNNING%4:1}"
	printf '\r⏳ Running unit tests with coverage... %ss %s' "$SECONDS_RUNNING" "$SPINNER_CHAR"
	sleep 1
	SECONDS_RUNNING=$((SECONDS_RUNNING + 1))
done

wait "$TEST_PID"
TEST_EXIT_CODE=$?

printf '\r\033[K✅ Test execution finished in %ss.\n' "$SECONDS_RUNNING"

cat "$TMP_OUTPUT" >>"$LOG_FILE"

SUMMARY_LINE="$(grep -E 'Executed [0-9]+ of [0-9]+' "$TMP_OUTPUT" | tail -1)"

EXECUTED=0
TOTAL=0
FAILED=0
SKIPPED=0

if [[ -n "$SUMMARY_LINE" ]]; then
	EXECUTED="$(echo "$SUMMARY_LINE" | sed -nE 's/.*Executed ([0-9]+) of ([0-9]+).*/\1/p')"
	TOTAL="$(echo "$SUMMARY_LINE" | sed -nE 's/.*Executed ([0-9]+) of ([0-9]+).*/\2/p')"

	FAILED_MATCH="$(echo "$SUMMARY_LINE" | sed -nE 's/.*\(([0-9]+) FAILED\).*/\1/p')"
	SKIPPED_MATCH="$(echo "$SUMMARY_LINE" | sed -nE 's/.*\(skipped ([0-9]+)\).*/\1/p')"

	if [[ -n "$FAILED_MATCH" ]]; then
		FAILED="$FAILED_MATCH"
	fi

	if [[ -n "$SKIPPED_MATCH" ]]; then
		SKIPPED="$SKIPPED_MATCH"
	fi
fi

PASSED=$((EXECUTED - FAILED))
if ((PASSED < 0)); then
	PASSED=0
fi

ENDED_AT="$(date '+%Y-%m-%d %H:%M:%S')"

{
	echo
	echo "========================================"
	echo "Test Summary"
	echo "🟢 Passed : $PASSED"
	echo "🔴 Failed : $FAILED"
	echo "🟡 Skipped: $SKIPPED"
	echo "Executed : $EXECUTED of $TOTAL"
	echo "Finished : $ENDED_AT"
	echo "Coverage : $ROOT_DIR/coverage"
	echo "Log File : $LOG_FILE"

	if [[ $TEST_EXIT_CODE -eq 0 ]]; then
		echo "Result   : ✅ Success"
	else
		echo "Result   : ❌ Failed"
	fi

	echo "========================================"
} | tee -a "$LOG_FILE"

exit $TEST_EXIT_CODE
