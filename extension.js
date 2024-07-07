const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerTextEditorCommand('extension.regexPaste', async (textEditor, edit) => {
        const config = vscode.workspace.getConfiguration('regexPaste');
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
                if (rule.match){
                    const match = modifiedText.match(regex);
                    if (match){
                        modifiedText = match.join()
                    }
                }else{
                    modifiedText = modifiedText.replace(regex, rule.replacement);
                }
            }

            // Insert the modified text
            textEditor.edit(editBuilder => {
                editBuilder.insert(textEditor.selection.active, modifiedText);
            });
        }
    });

    context.subscriptions.push(disposable);
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