import re
import hashlib

def chunk_python_file(content: str, file_path: str):
    """
    Splits a Python file into function/class-level chunks.
    Falls back to fixed-size chunks if no functions/classes found.
    """
    chunks = []
    lines = content.split('\n')

    # Match top-level and indented function/class definitions
    pattern = re.compile(r'^(\s*)(def |class )(\w+)')

    current_chunk_start = 0
    current_name = None
    current_indent = None

    boundaries = []
    for i, line in enumerate(lines):
        match = pattern.match(line)
        if match:
            indent = len(match.group(1))
            # Only track top-level or class-level definitions (indent 0 or 4)
            if indent <= 4:
                boundaries.append((i, match.group(3), match.group(2).strip()))

    if not boundaries:
        # No functions found — chunk by fixed size (50 lines)
        for i in range(0, len(lines), 50):
            chunk_lines = lines[i:i+50]
            chunks.append({
                'content': '\n'.join(chunk_lines),
                'function_name': None,
                'start_line': i + 1,
                'end_line': min(i + 50, len(lines)),
            })
        return chunks

    # Build chunks from boundaries
    for idx, (start_line, name, kind) in enumerate(boundaries):
        end_line = boundaries[idx + 1][0] if idx + 1 < len(boundaries) else len(lines)
        chunk_content = '\n'.join(lines[start_line:end_line]).strip()

        if len(chunk_content) < 10:
            continue

        chunks.append({
            'content': chunk_content,
            'function_name': name,
            'start_line': start_line + 1,
            'end_line': end_line,
        })

    return chunks


def chunk_js_file(content: str, file_path: str):
    """
    Splits a JS/TS file into function-level chunks.
    Matches: function foo(), const foo = () =>, class Foo, async function foo()
    """
    chunks = []
    lines = content.split('\n')

    pattern = re.compile(
        r'^\s*(export\s+)?(async\s+)?(function\s+(\w+)|const\s+(\w+)\s*=\s*(async\s*)?\(|class\s+(\w+))'
    )

    boundaries = []
    for i, line in enumerate(lines):
        match = pattern.match(line)
        if match:
            name = match.group(4) or match.group(5) or match.group(7)
            if name:
                boundaries.append((i, name))

    if not boundaries:
        for i in range(0, len(lines), 50):
            chunk_lines = lines[i:i+50]
            chunks.append({
                'content': '\n'.join(chunk_lines),
                'function_name': None,
                'start_line': i + 1,
                'end_line': min(i + 50, len(lines)),
            })
        return chunks

    for idx, (start_line, name) in enumerate(boundaries):
        end_line = boundaries[idx + 1][0] if idx + 1 < len(boundaries) else len(lines)
        chunk_content = '\n'.join(lines[start_line:end_line]).strip()

        if len(chunk_content) < 10:
            continue

        chunks.append({
            'content': chunk_content,
            'function_name': name,
            'start_line': start_line + 1,
            'end_line': end_line,
        })

    return chunks


def chunk_file(content: str, file_path: str):
    """Routes to the right chunker based on file extension."""
    if file_path.endswith('.py'):
        return chunk_python_file(content, file_path)
    elif file_path.endswith(('.js', '.jsx', '.ts', '.tsx')):
        return chunk_js_file(content, file_path)
    else:
        # Unsupported file type — skip
        return []


def make_chunk_id(repo_id: str, file_path: str, start_line: int) -> str:
    raw = f"{repo_id}:{file_path}:{start_line}"
    return hashlib.md5(raw.encode()).hexdigest()