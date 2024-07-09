# Magic Clipboard

This VSCode extension modifies pasted text based on predefined regex patterns and conditions.

## Features

- Automatically applies regex patterns to text when pasting with Ctrl+Shift+V (Cmd+Shift+V on Mac).
- Customizable regex patterns, replacements, and conditions.
- Condition checking for both file and line scopes.

## Usage

1. Copy text to your clipboard.
2. In VSCode, use Ctrl+Shift+V (or Cmd+Shift+V on Mac) to paste. The extension will automatically modify the text based on your configured rules.

## Configuration

Configure the regex rules in your VSCode settings (settings.json):

```json
"regexPaste.rules": [
    {
        "pattern": " page\\.",
        "replacement": " this.page.",
        "condition": {
            "pattern": "this\\.page\\s*=\\s*page;",
            "scope": "file"
        }
    }
]
```

Each rule can have:
- `pattern`: The regex pattern to match in the clipboard text.
- `replacement`: The string to replace the matched pattern.
- `condition` (optional):
  - `pattern`: A regex pattern to check in the existing file or line.
  - `scope`: Either "file" or "line", determining where to check the condition.


## Development

This extension is written in JavaScript. To set up the development environment:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Open the project in VSCode
4. Press F5 to run the extension in debug mode

