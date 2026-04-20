#!/usr/bin/env python3
"""Verify backend coverage from the Cobertura XML emitted by coverlet.

Fails (exit != 0) when line-rate is below LINE_THRESHOLD or branch-rate is
below BRANCH_THRESHOLD. Designed to be called from CI right after
`dotnet test --collect:"XPlat Code Coverage"`.

Usage:
    check-coverage.py <coverage-file-or-glob> [--line N] [--branch N]
"""
from __future__ import annotations

import argparse
import glob
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def find_coverage_file(pattern: str) -> Path:
    matches = sorted(glob.glob(pattern, recursive=True))
    if not matches:
        sys.exit(f"[check-coverage] No coverage file matched '{pattern}'")
    return Path(matches[-1])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pattern", help="Path or glob to cobertura XML")
    parser.add_argument("--line", type=float, default=80.0, help="Min line coverage %% (default: 80)")
    parser.add_argument("--branch", type=float, default=70.0, help="Min branch coverage %% (default: 70)")
    args = parser.parse_args()

    path = find_coverage_file(args.pattern)
    root = ET.parse(path).getroot()

    line_rate = float(root.get("line-rate", 0)) * 100
    branch_rate = float(root.get("branch-rate", 0)) * 100

    print(f"[check-coverage] file: {path}")
    print(f"[check-coverage] line   = {line_rate:6.2f}%  (threshold {args.line}%)")
    print(f"[check-coverage] branch = {branch_rate:6.2f}%  (threshold {args.branch}%)")
    print("[check-coverage] per package:")
    for pkg in root.findall(".//package"):
        name = pkg.get("name", "?")
        lr = float(pkg.get("line-rate", 0)) * 100
        br = float(pkg.get("branch-rate", 0)) * 100
        print(f"    {name:<40s} line {lr:6.2f}%  branch {br:6.2f}%")

    failures = []
    if line_rate < args.line:
        failures.append(f"line-rate {line_rate:.2f}% < {args.line}%")
    if branch_rate < args.branch:
        failures.append(f"branch-rate {branch_rate:.2f}% < {args.branch}%")

    if failures:
        print("[check-coverage] FAILED: " + "; ".join(failures), file=sys.stderr)
        return 1

    print("[check-coverage] OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
