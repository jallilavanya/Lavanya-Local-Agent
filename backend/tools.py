from pathlib import Path
import subprocess


# Project that the agent is allowed to work inside
WORKSPACE = Path(r"D:\lavanya-agent").resolve()


def safe_path(path: str) -> Path:
    """
    Convert a user-provided path into a path inside WORKSPACE.
    Prevents the agent from accessing files outside the workspace.
    """
    target = (WORKSPACE / path).resolve()

    if target != WORKSPACE and WORKSPACE not in target.parents:
        raise ValueError("Access denied: path is outside the workspace.")

    return target


def list_files(path: str = "."):
    target = safe_path(path)

    if not target.exists():
        return {"error": "Path does not exist"}

    if not target.is_dir():
        return {"error": "Path is not a directory"}

    files = []

    for item in target.rglob("*"):
        if item.is_file():
            files.append(str(item.relative_to(WORKSPACE)))

    return {
        "files": files[:500]
    }


def read_file(path: str):
    target = safe_path(path)

    if not target.exists():
        return {"error": "File does not exist"}

    if not target.is_file():
        return {"error": "Not a file"}

    try:
        content = target.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return {"error": "File is not a UTF-8 text file"}

    return {
        "path": str(target.relative_to(WORKSPACE)),
        "content": content,
    }


def write_file(path: str, content: str):
    target = safe_path(path)

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")

    return {
        "success": True,
        "path": str(target.relative_to(WORKSPACE)),
    }


def run_command(command: str):
    """
    Run a command inside the workspace.
    """

    result = subprocess.run(
        command,
        shell=True,
        cwd=WORKSPACE,
        capture_output=True,
        text=True,
        timeout=120,
    )

    return {
        "command": command,
        "returncode": result.returncode,
        "stdout": result.stdout[-10000:],
        "stderr": result.stderr[-10000:],
    }