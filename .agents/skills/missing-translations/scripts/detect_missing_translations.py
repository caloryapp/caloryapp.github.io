#!/usr/bin/env python3
"""
Detect missing translations in src/pages/ .ts and .tsx files.

This script scans TypeScript/TSX files for hardcoded English strings that should
be internationalized using i18next (t`translation-key` syntax).

Usage:
    python3 scripts/detect_missing_translations.py

Output:
    Prints a report of files with missing translations, including:
    - File path and line number
    - The hardcoded English string found
    - Suggested translation key
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple

# Configuration
PAGES_DIR = Path("src/pages")
LOCALES_DIR = Path("src/locales")
SUPPORTED_EXTENSIONS = {".ts", ".tsx"}

# Patterns to detect
# Match text content in JSX: >Some Text< or >Some Text</
JSX_TEXT_PATTERN = re.compile(r'>([^<>\n]{2,})<')
# Match text in attributes: label="Some Text" or title="Some Text"
ATTRIBUTE_TEXT_PATTERN = re.compile(r'\b(?:label|title|placeholder|alt|aria-label)="([^"]{2,})"')
# Already translated: t`key` or {t`key`}
TRANSLATION_PATTERN = re.compile(r'(?:\{)?t`([^`]+)`(?:\})?')
# Comments (to skip)
COMMENT_PATTERN = re.compile(r'//.*|/\*.*?\*/', re.DOTALL)


def get_all_pages_files() -> List[Path]:
    """Get all .ts and .tsx files in src/pages/."""
    files = []
    if PAGES_DIR.exists():
        for ext in SUPPORTED_EXTENSIONS:
            files.extend(PAGES_DIR.rglob(f"*{ext}"))
    return sorted(files)


def load_existing_translations() -> set:
    """Load all existing translation keys from locale files."""
    keys = set()
    if LOCALES_DIR.exists():
        for locale_file in LOCALES_DIR.glob("*.json"):
            try:
                with open(locale_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    keys.update(data.keys())
            except (json.JSONDecodeError, IOError):
                pass
    return keys


def is_likely_english(text: str) -> bool:
    """Check if text is likely English and should be translated."""
    # Skip if empty or too short
    if len(text.strip()) < 2:
        return False
    
    # Skip if it looks like code (camelCase, PascalCase, snake_case)
    if re.match(r'^[a-z]+([A-Z][a-z]+)+$', text):  # camelCase
        return False
    if re.match(r'^[A-Z][a-z]+([A-Z][a-z]+)+$', text):  # PascalCase
        return False
    if re.match(r'^[a-z]+_[a-z_]+$', text):  # snake_case
        return False
    
    # Skip if it looks like a CSS class or variable
    if text.startswith(".") or text.startswith("#"):
        return False
    
    # Skip if it's a file path
    if "/" in text or "\\" in text:
        return False
    
    # Skip if it's mostly numbers/special chars
    if len(re.findall(r'[a-zA-Z]', text)) < len(text) * 0.5:
        return False
    
    # Skip common non-translatable strings
    skip_patterns = [
        r'^\d+$',  # Just numbers
        r'^\d+[a-zA-Z]+$',  # Numbers with units like 100px
        r'^[a-f0-9-]{36}$',  # UUIDs
        r'^https?://',  # URLs
        r'^#[0-9a-fA-F]{3,8}$',  # Hex colors
        r'^rgba?\(',  # RGB colors
    ]
    for pattern in skip_patterns:
        if re.match(pattern, text.strip()):
            return False
    
    # Must contain at least one English word (basic check)
    return bool(re.search(r'[a-zA-Z]{2,}', text))


def suggest_key(text: str) -> str:
    """Generate a suggested translation key from text."""
    # Convert to lowercase and replace spaces/special chars with hyphens
    key = text.lower().strip()
    key = re.sub(r'[^\w\s-]', '', key)  # Remove special chars except hyphens
    key = re.sub(r'\s+', '-', key)  # Replace spaces with hyphens
    key = re.sub(r'-+', '-', key)  # Collapse multiple hyphens
    return key[:50]  # Limit length


def scan_file(file_path: Path, existing_keys: set) -> List[Dict]:
    """Scan a single file for missing translations."""
    issues = []
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            lines = content.split('\n')
    except IOError as e:
        print(f"Error reading {file_path}: {e}")
        return issues
    
    # Track which lines already have translations
    translation_lines = set()
    for match in TRANSLATION_PATTERN.finditer(content):
        # Find which line this translation is on
        line_num = content[:match.start()].count('\n') + 1
        translation_lines.add(line_num)
    
    # Scan each line
    for line_num, line in enumerate(lines, 1):
        # Skip if this line already has translations
        if line_num in translation_lines:
            continue
        
        # Skip import statements and type definitions
        if re.match(r'^\s*(import|export|type|interface)', line):
            continue
        
        # Remove comments from the line for checking
        line_clean = re.sub(r'//.*$', '', line)
        
        # Find JSX text content
        for match in JSX_TEXT_PATTERN.finditer(line):
            text = match.group(1).strip()
            if is_likely_english(text):
                suggested_key = suggest_key(text)
                # Check if a similar key already exists
                key_exists = suggested_key in existing_keys or any(
                    text.lower() in k.lower() for k in existing_keys
                )
                issues.append({
                    'line': line_num,
                    'text': text,
                    'suggested_key': suggested_key,
                    'key_exists': key_exists,
                    'type': 'JSX text'
                })
        
        # Find attribute text
        for match in ATTRIBUTE_TEXT_PATTERN.finditer(line):
            text = match.group(1).strip()
            if is_likely_english(text):
                suggested_key = suggest_key(text)
                key_exists = suggested_key in existing_keys or any(
                    text.lower() in k.lower() for k in existing_keys
                )
                issues.append({
                    'line': line_num,
                    'text': text,
                    'suggested_key': suggested_key,
                    'key_exists': key_exists,
                    'type': f'attribute ({match.group(0).split("=")[0]})'
                })
    
    return issues


def print_report(results: Dict[Path, List[Dict]]) -> None:
    """Print a formatted report of missing translations."""
    print("=" * 70)
    print("MISSING TRANSLATIONS REPORT")
    print("=" * 70)
    print()
    
    total_issues = 0
    files_with_issues = 0
    
    for file_path, issues in sorted(results.items()):
        if not issues:
            continue
        
        files_with_issues += 1
        total_issues += len(issues)
        
        print(f"📄 {file_path}")
        print("-" * 70)
        
        for issue in issues:
            line_info = f"  Line {issue['line']}"
            text_info = f"'{issue['text']}'"
            key_info = f"  → Suggest: {issue['suggested_key']}"
            
            if issue['key_exists']:
                key_info += " (⚠️ key already exists!)"
            
            print(f"{line_info} [{issue['type']}]: {text_info}")
            print(key_info)
            print()
    
    print("=" * 70)
    print(f"SUMMARY: {total_issues} issue(s) found in {files_with_issues} file(s)")
    print("=" * 70)
    
    if total_issues > 0:
        print()
        print("To fix these issues:")
        print("1. Add the translation key to src/locales/en.json and src/locales/es.json")
        print("2. Replace the hardcoded text with: {t`suggested-key`}")
        print()
        print("Example:")
        print('  <span>Calory App</span>')
        print("  →")
        print('  <span>{t`app-title`}</span>')


def main():
    """Main entry point."""
    # Change to project root if running from script directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent.parent.parent
    os.chdir(project_root)
    
    # Load existing translations
    existing_keys = load_existing_translations()
    
    # Get all files to scan
    files = get_all_pages_files()
    
    if not files:
        print(f"No .ts/.tsx files found in {PAGES_DIR}")
        return
    
    # Scan each file
    results = {}
    for file_path in files:
        issues = scan_file(file_path, existing_keys)
        results[file_path] = issues
    
    # Print report
    print_report(results)


if __name__ == "__main__":
    main()
