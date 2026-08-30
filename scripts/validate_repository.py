import json
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {".git", "node_modules"}
errors: list[str] = []


def included(path: Path) -> bool:
    return not any(part in EXCLUDED for part in path.parts)


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hrefs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]) -> None:
        for name, value in attrs:
            if name == "href" and value is not None:
                self.hrefs.append(value)

    handle_startendtag = handle_starttag


def inside_repository(path: Path) -> bool:
    try:
        path.relative_to(ROOT.resolve())
        return True
    except ValueError:
        return False


for html_file in ROOT.rglob("*.html"):
    if not included(html_file):
        continue
    text = html_file.read_text(encoding="utf-8", errors="replace")
    if "<!doctype html>" not in text.lower():
        errors.append(f"Missing DOCTYPE: {html_file.relative_to(ROOT)}")

    parser = LinkParser()
    parser.feed(text)
    for href in parser.hrefs:
        parsed = urlparse(href)
        if not href or href.startswith("#") or parsed.scheme.lower() in {
            "mailto",
            "tel",
            "javascript",
        }:
            continue
        if parsed.scheme or parsed.netloc or href.startswith("//"):
            continue
        target = unquote(parsed.path)
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
        resolved_target = target_path.resolve()
        if not inside_repository(resolved_target):
            errors.append(
                f"Local link escapes repository in {html_file.relative_to(ROOT)}: {href}"
            )
        elif not resolved_target.exists():
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
