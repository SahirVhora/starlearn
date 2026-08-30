import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


VALIDATOR = Path(__file__).resolve().parents[1] / "scripts" / "validate_repository.py"


class RepositoryValidatorTests(unittest.TestCase):
    def run_validator(self, html: str, files: tuple[str, ...] = ()) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir) / "starlearn"
            scripts = root / "scripts"
            scripts.mkdir(parents=True)
            shutil.copy2(VALIDATOR, scripts / "validate_repository.py")
            (root / "index.html").write_text(html, encoding="utf-8")
            for relative_path in files:
                target = root / relative_path
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text("{}" if target.suffix == ".json" else "ok", encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(scripts / "validate_repository.py")],
                cwd=root,
                capture_output=True,
                text=True,
                check=False,
            )

    def test_detects_missing_links_with_normal_html_attribute_variants(self):
        for attribute in ("href='missing.html'", 'HREF="missing.html"', 'href = "missing.html"'):
            with self.subTest(attribute=attribute):
                result = self.run_validator(f"<!DOCTYPE html><a {attribute}>missing</a>")
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn("Broken local link", result.stdout)

    def test_accepts_project_root_links_queries_and_fragments(self):
        result = self.run_validator(
            '<!DOCTYPE html><link href="/starlearn/manifest.json?v=1#app">',
            files=("manifest.json",),
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_rejects_links_that_escape_the_repository(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir) / "starlearn"
            scripts = root / "scripts"
            scripts.mkdir(parents=True)
            shutil.copy2(VALIDATOR, scripts / "validate_repository.py")
            (root / "index.html").write_text(
                '<!DOCTYPE html><a href="../outside.html">outside</a>', encoding="utf-8"
            )
            (Path(temp_dir) / "outside.html").write_text("exists", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(scripts / "validate_repository.py")],
                cwd=root,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("escapes repository", result.stdout)


if __name__ == "__main__":
    unittest.main()
