import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {".git", "node_modules"}
errors: list[str] = []


def included(path: Path) -> bool:
    return not any(part in EXCLUDED for part in path.parts)


for html_file in ROOT.rglob("*.html"):
    if not included(html_file):
        continue
    text = html_file.read_text(encoding="utf-8", errors="replace")
    if "<!doctype html>" not in text.lower():
        errors.append(f"Missing DOCTYPE: {html_file.relative_to(ROOT)}")

    marker = 'href="'
    start = 0
    while True:
        index = text.find(marker, start)
        if index < 0:
            break
        value_start = index + len(marker)
        value_end = text.find('"', value_start)
        if value_end < 0:
            break
        href = text[value_start:value_end]
        start = value_end + 1
        parsed = urlparse(href)
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        if parsed.scheme or parsed.netloc or href.startswith("//"):
            continue
        target = href.split("#", 1)[0].split("?", 1)[0]
        if not target:
            continue
        if target.startswith("/"):
            # GitHub Pages project sites use /<repo>/... URLs. Resolve those
            # against the repository root instead of the runner filesystem root.
            parts = Path(target.lstrip("/")).parts
            if parts and parts[0] == ROOT.name:
                parts = parts[1:]
            target_path = ROOT.joinpath(*parts)
        else:
            target_path = html_file.parent / target
        if not target_path.resolve().exists():
            errors.append(f"Broken local link in {html_file.relative_to(ROOT)}: {href}")

for json_file in ROOT.rglob("*.json"):
    if not included(json_file):
        continue
    try:
        json.loads(json_file.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        errors.append(f"Invalid JSON {json_file.relative_to(ROOT)}: {exc}")

for file_path in ROOT.rglob("*"):
    if file_path.is_file() and included(file_path) and file_path.stat().st_size > 5 * 1024 * 1024:
        errors.append(f"File exceeds 5 MiB: {file_path.relative_to(ROOT)}")

if errors:
    print("Repository validation failed:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print("Repository validation passed")
