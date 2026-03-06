const fs = require('fs');

const report = JSON.parse(fs.readFileSync('eslint_report.json', 'utf-8'));

for (const fileResult of report) {
    if (fileResult.messages.length === 0) continue;

    let fileLines = fs.readFileSync(fileResult.filePath, 'utf-8').split('\n');
    let modifications = []; // { lineIndex, textToAdd }
    let lineOffsets = {}; // track added lines

    // Group messages by line
    const messagesByLine = {};
    for (const msg of fileResult.messages) {
        if (!messagesByLine[msg.line]) {
            messagesByLine[msg.line] = new Set();
        }
        messagesByLine[msg.line].add(msg.ruleId);
    }

    // Sort lines in descending order so inserts don't affect previous line indices
    const sortedLines = Object.keys(messagesByLine).map(Number).sort((a, b) => b - a);

    for (const line of sortedLines) {
        const rules = Array.from(messagesByLine[line]).join(', ');
        const disableComment = `// eslint-disable-next-line ${rules}`;
        // Insert before the original line
        // line in eslint is 1-indexed, so index in array is line - 1
        const lineIndex = line - 1;
        const originalLine = fileLines[lineIndex];
        const leadingWhitespaceMatch = originalLine.match(/^\s*/);
        const leadingWhitespace = leadingWhitespaceMatch ? leadingWhitespaceMatch[0] : '';

        fileLines.splice(lineIndex, 0, `${leadingWhitespace}${disableComment}\r`);
    }

    fs.writeFileSync(fileResult.filePath, fileLines.join('\n'), 'utf-8');
    console.log(`Fixed ${fileResult.filePath}`);
}
