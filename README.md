# Magic Clipboard

This VSCode extension modifies pasted text based on predefined regex patterns and conditions.

## Features

- Automatically applies regex patterns to text when pasting with Ctrl+Shift+V (Cmd+Shift+V on Mac).
- Customizable regex patterns, replacements, and conditions.
- Condition checking for both file and line scopes.

## Usage

1. Copy text to your clipboard.
2. In VSCode, use Ctrl+Shift+V (or Cmd+Shift+V on Mac) to paste. The extension will automatically modify the text based on your configured rules.

## Default rules

1. ID to CSS attribute selector:

Converts IDs to CSS attribute selectors.

Example: `button_123_submit` → `[id^=button_][id$=_submit]`

2. Wrap in locator function:

Encapsulates CSS attribute selectors in `locator()`.

Example: `[id^=button_][id$=_submit]` → `locator('[id^=button_][id$=_submit]')`

3. Prepend page object:

Adds `page` before Playwright selector methods.

Example: `getByRole('button')` → `page.getByRole('button')`

4. Contextualize page reference:

Changes `page` to `this.page` (in POM files only)

Example: `page.click('.button')` → `this.page.click('.button')`

## Configuration

Configure the regex rules in your VSCode settings (settings.json):

```json
"magicClipboard.rules": [
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


