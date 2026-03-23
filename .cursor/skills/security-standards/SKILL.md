---
name: security-standards
description: Audit AEM Edge Delivery blocks for security vulnerabilities including XSS, unsafe fetch patterns, prototype pollution, open redirects, token exposure, and DOM clobbering. Use when reviewing code changes, creating or editing blocks, handling user input, fetching external data, or manipulating the DOM.
---

# Security Standards for AEM Edge Delivery

## Instructions

When auditing code, check each category below. Report every finding using the output format at the end.

## Vulnerability Checklist

### 1. Cross-Site Scripting (XSS)

- **NEVER use `innerHTML` with user-supplied or external data**
- Use `textContent` for plain text, `createElement` + `append` for structured content
- If HTML insertion is absolutely required, sanitize with DOMPurify or equivalent
- Check all `data-*` attributes read from the DOM before using in string concatenation

```javascript
// BAD
block.innerHTML = `<div>${userInput}</div>`;
element.innerHTML = response.html;

// GOOD
const div = document.createElement('div');
div.textContent = userInput;
block.append(div);
```

### 2. Unsafe Fetch Patterns

- Wrap `fetch()` calls in try/catch
- Validate response status before using data
- Never expose API keys or tokens in client-side code

```javascript
// BAD
const data = await fetch(url).then(r => r.json());

// GOOD
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
} catch (error) {
  // Handle gracefully, don't expose error details to user
}
```

### 3. Prototype Pollution

- Never use `Object.assign` with unsanitized external data
- Validate object keys before dynamic property access
- Use `Object.create(null)` for lookup maps

### 4. Open Redirects

- Validate URLs before using in `window.location` or `<a href>`
- Only allow relative URLs or known domains
- Never construct redirect URLs from query parameters without validation

### 5. Session/Token Exposure

- Never store tokens in `localStorage` for authenticated flows
- Never log sensitive data to console in production
- Never include tokens in URL query parameters
- Ensure error messages don't leak internal paths or credentials

### 6. DOM Clobbering

- Use unique, namespaced IDs for block elements
- Don't rely on `document.getElementById` with author-controlled content
- Prefix block-specific IDs with the block name

## Severity Classification

| Severity | Examples |
|----------|----------|
| **HIGH** | XSS via innerHTML, exposed credentials, missing auth checks |
| **MEDIUM** | Missing error handling on fetch, unvalidated redirects, prototype pollution vectors |
| **LOW** | Console.log with sensitive data, non-namespaced IDs, missing validation on non-critical fields |

## Output Format

Report each finding as:

```
🔴/🟡/🟢 [HIGH/MEDIUM/LOW] — <vulnerability type>

File: <path>
Line: <number>
Description: <what's wrong and why it's dangerous>
Fix: <specific code change>
```
