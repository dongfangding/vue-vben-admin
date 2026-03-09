#!/usr/bin/env python3
"""Manual package script with UTF-8 encoding"""

import sys
import os
import re
import yaml
import zipfile
from pathlib import Path

def validate_skill(skill_path):
    """Basic validation of a skill"""
    skill_path = Path(skill_path)

    # Check SKILL.md exists
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, "SKILL.md not found"

    # Read and validate frontmatter - UTF-8 encoding
    content = skill_md.read_text(encoding='utf-8')
    if not content.startswith('---'):
        return False, "No YAML frontmatter found"

    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format"

    frontmatter_text = match.group(1)

    # Parse YAML frontmatter
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        if not isinstance(frontmatter, dict):
            return False, "Frontmatter must be a YAML dictionary"
    except yaml.YAMLError as e:
        return False, f"Invalid YAML in frontmatter: {e}"

    ALLOWED_PROPERTIES = {'name', 'description', 'license', 'allowed-tools', 'metadata'}

    unexpected_keys = set(frontmatter.keys()) - ALLOWED_PROPERTIES
    if unexpected_keys:
        return False, f"Unexpected key(s): {', '.join(sorted(unexpected_keys))}"

    if 'name' not in frontmatter:
        return False, "Missing 'name' in frontmatter"
    if 'description' not in frontmatter:
        return False, "Missing 'description' in frontmatter"

    name = frontmatter.get('name', '').strip()
    if name:
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"Name '{name}' should be hyphen-case"
        if name.startswith('-') or name.endswith('-') or '--' in name:
            return False, f"Name '{name}' cannot start/end with hyphen"

    description = frontmatter.get('description', '').strip()
    if description:
        if '<' in description or '>' in description:
            return False, "Description cannot contain angle brackets"

    return True, "Skill is valid!"

def package_skill(skill_path, output_dir='.'):
    """Package skill into a .skill file"""
    skill_path = Path(skill_path)
    output_dir = Path(output_dir)

    # Validate
    valid, message = validate_skill(skill_path)
    if not valid:
        print(f"Validation failed: {message}")
        return False

    print(f"Validation passed!")

    # Create package
    skill_name = skill_path.name
    output_file = output_dir / f"{skill_name}.skill"

    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file_path in skill_path.rglob('*'):
            if file_path.is_file():
                arcname = file_path.relative_to(skill_path)
                zf.write(file_path, arcname)

    print(f"Package created: {output_file}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python package.py <skill_directory>")
        sys.exit(1)

    skill_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else '.'

    success = package_skill(skill_path, output_dir)
    sys.exit(0 if success else 1)
