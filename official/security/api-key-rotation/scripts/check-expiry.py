#!/usr/bin/env python3
"""Check API key expiration dates and send alerts.

Usage:
    python check-expiry.py --config keys.json
    python check-expiry.py --exchange binance --warn-days 30
"""

import argparse
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path


def check_key_expiry(key_info: dict, warn_days: int = 30) -> dict:
    """Check if an API key is approaching expiration."""
    created = datetime.fromisoformat(key_info["created_at"])
    max_age = timedelta(days=key_info.get("max_age_days", 90))
    expires = created + max_age
    now = datetime.now()
    days_remaining = (expires - now).days

    status = "ok"
    if days_remaining <= 0:
        status = "expired"
    elif days_remaining <= warn_days:
        status = "warning"

    return {
        "key_id": key_info["key_id"],
        "exchange": key_info["exchange"],
        "created_at": key_info["created_at"],
        "expires_at": expires.isoformat(),
        "days_remaining": days_remaining,
        "status": status,
    }


def main():
    parser = argparse.ArgumentParser(description="Check API key expiration")
    parser.add_argument("--config", type=str, help="Path to keys config JSON")
    parser.add_argument("--warn-days", type=int, default=30, help="Warning threshold in days")
    args = parser.parse_args()

    # Example keys for demonstration
    example_keys = [
        {
            "key_id": "key_001",
            "exchange": "binance",
            "created_at": "2025-11-01T00:00:00",
            "max_age_days": 90,
        },
        {
            "key_id": "key_002",
            "exchange": "binance",
            "created_at": "2026-01-15T00:00:00",
            "max_age_days": 90,
        },
    ]

    if args.config:
        config_path = Path(args.config)
        if config_path.exists():
            with open(config_path) as f:
                example_keys = json.load(f)

    print(f"{'Key ID':<12} {'Exchange':<10} {'Expires':<22} {'Days Left':<10} {'Status'}")
    print("-" * 70)

    has_issues = False
    for key in example_keys:
        result = check_key_expiry(key, args.warn_days)
        status_icon = {"ok": "OK", "warning": "WARN", "expired": "EXPIRED"}[result["status"]]
        print(
            f"{result['key_id']:<12} {result['exchange']:<10} "
            f"{result['expires_at']:<22} {result['days_remaining']:<10} {status_icon}"
        )
        if result["status"] != "ok":
            has_issues = True

    if has_issues:
        print("\nAction required: Some keys need rotation!")
        sys.exit(1)
    else:
        print("\nAll keys are within acceptable age.")


if __name__ == "__main__":
    main()
