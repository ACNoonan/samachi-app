from pathlib import Path

def project_root() -> Path:
    """Return the project root directory (five levels up from this file)."""
    return Path(__file__).resolve().parent.parent.parent.parent.parent

def scripts_root() -> Path:
    """Return the root directory for Python DB scripts"""
    return Path(__file__).resolve().parent.parent