const vscode = require('vscode');
let magicClipboardDebug = vscode.window.createOutputChannel("Magic Clipboard");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerTextEditorCommand('extension.magicClipboard', async (textEditor) => {
        const config = vscode.workspace.getConfiguration('magicClipboard');
        if (config.debug)
            magicClipboardDebug.show();
        const rules = config.get('rules') || [];

        const clipboard = await vscode.env.clipboard.readText();
        if (clipboard) {
            let modifiedText = clipboard;

            for (const rule of rules) {
                if (rule.condition) {
                    const conditionMet = await checkCondition(textEditor, rule.condition);
                    if (!conditionMet) continue;
                }

                const regex = new RegExp(rule.pattern, 'g');
                magicClipboardDebug.appendLine(`rule: ${regex}`);
                if (rule.match){
                    const match = regex.exec(modifiedText);
                    if (match){
                        modifiedText = rule.replacement.replace('$1', match[1]).replace('$2', match[2]).replace('$3', match[3]).replace('$4', match[4]).replace('$5', match[5]).replace('$6', match[6]).replace('$7', match[7]).replace('$8', match[8]).replace('$9', match[9]);
                    }
                    magicClipboardDebug.appendLine(`match: ${match?.[0]}`);
                    magicClipboardDebug.appendLine(`modifiedText: ${modifiedText}`);
                }else{
                    modifiedText = modifiedText.replace(regex, rule.replacement);
                    magicClipboardDebug.appendLine(`modifiedText: ${modifiedText}`);

                }
            }

            const indentedText = adjustIndentation(textEditor, modifiedText);

            // Insert the modified and indented text
            textEditor.edit(editBuilder => {
                editBuilder.insert(textEditor.selection.active, indentedText);
            });
        }
    });

    context.subscriptions.push(disposable);
}

function adjustIndentation(textEditor, text) {
    const currentIndent = textEditor.document.lineAt(textEditor.selection.active.line).text.match(/^\s*/)[0];
    return text.split('\n').map((line, index) => 
        index === 0 ? line.trimLeft() : currentIndent + line.trimLeft()
    ).join('\n');
}

/**
 * @param {vscode.TextEditor} textEditor
 * @param {{ pattern: string, scope: 'file' | 'line' }} condition
 * @returns {Promise<boolean>}
 */
async function checkCondition(textEditor, condition) {
    const regex = new RegExp(condition.pattern);

    if (condition.scope === 'file') {
        const fullText = textEditor.document.getText();
        return regex.test(fullText);
    } else if (condition.scope === 'line') {
        const line = textEditor.document.lineAt(textEditor.selection.active.line);
        return regex.test(line.text);
    }

    return false;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}