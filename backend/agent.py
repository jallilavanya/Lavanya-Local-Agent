import json

from ollama_client import chat
from tools import list_files, read_file, write_file, run_command


TOOLS = {
    "list_files": list_files,
    "read_file": read_file,
    "write_file": write_file,
    "run_command": run_command,
}


SYSTEM_PROMPT = """
You are Lavanya Local Coding Agent.

You are an autonomous coding assistant running locally.

You can inspect and modify the user's project using tools.

Available tools:

1. list_files
   {"path": "."}

2. read_file
   {"path": "relative/path"}

3. write_file
   {"path": "relative/path", "content": "file contents"}

4. run_command
   {"command": "command to execute"}

IMPORTANT:
- Work only inside the allowed workspace.
- Inspect files before modifying them.
- Do not invent file contents when you can read the file.
- When you need a tool, output ONLY this JSON:

{
  "tool": "tool_name",
  "arguments": {
    "argument": "value"
  }
}

- After receiving a tool result, continue reasoning.
- When the task is complete, respond normally.
"""


def extract_tool_call(text):
    """
    Try to extract a JSON tool call from the model response.
    """

    text = text.strip()

    try:
        data = json.loads(text)

        if isinstance(data, dict) and "tool" in data:
            return data

    except json.JSONDecodeError:
        pass

    return None


def execute_tool(tool_call):
    tool_name = tool_call.get("tool")
    arguments = tool_call.get("arguments", {})

    if tool_name not in TOOLS:
        return {
            "error": f"Unknown tool: {tool_name}"
        }

    try:
        return TOOLS[tool_name](**arguments)

    except Exception as e:
        return {
            "error": str(e)
        }


def run_agent(user_message, max_steps=10):

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": user_message,
        },
    ]

    for step in range(max_steps):

        answer = chat(messages)

        tool_call = extract_tool_call(answer)

        # Normal final response
        if not tool_call:
            return answer

        # Execute requested tool
        result = execute_tool(tool_call)

        # Give the model the tool result
        messages.append(
            {
                "role": "assistant",
                "content": answer,
            }
        )

        messages.append(
            {
                "role": "user",
                "content": (
                    "Tool result:\n"
                    + json.dumps(result, indent=2)
                    + "\n\nContinue the task."
                ),
            }
        )

    return "Agent stopped because the maximum number of steps was reached."