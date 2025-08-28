/**
 * Parse .env file content into key-value pairs
 */
export function parseEnvFile(
  content: string
): { key: string; value: string }[] {
  const lines = content.split('\n');
  const variables: { key: string; value: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Find the first = character
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) {
      continue; // Skip lines without =
    }

    const key = trimmed.slice(0, equalIndex).trim();
    let value = trimmed.slice(equalIndex + 1).trim();

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      variables.push({ key, value });
    }
  }

  return variables;
}

/**
 * Convert variables array to .env file format
 */
export function generateEnvFile(
  variables: { key: string; value: string; description?: string }[]
): string {
  let content = '';

  for (const variable of variables) {
    if (variable.description) {
      content += `# ${variable.description}\n`;
    }

    // Quote value if it contains spaces or special characters
    let value = variable.value;
    if (value.includes(' ') || value.includes('#') || value.includes('\n')) {
      value = `"${value.replace(/"/g, '\\"')}"`;
    }

    content += `${variable.key}=${value}\n\n`;
  }

  return content.trim();
}

/**
 * Download content as a file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
