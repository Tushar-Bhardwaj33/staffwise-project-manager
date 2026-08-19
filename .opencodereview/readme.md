# OpenCodeReview

Open Code Review is an AI-powered code review CLI tool. This directory contains configuration and context files for OpenCodeReview.

## Prerequisites

- **Git >= 2.41** — Open Code Review relies on Git for diff generation, code search, and repository operations.

## Quick Start

### 01 Install
One-command global install via npm.

```bash
npm i -g @alibaba-group/open-code-review
```
**Verify Installation:**
```bash
ocr version
```

### 02 Configure
Set up your LLM provider interactively, or configure manually.

**Interactive Setup (Recommended)**
```bash
ocr config provider
```

**Manual Config (Alternative)**
```bash
ocr config set llm.url https://api.anthropic.com \
    && ocr config set llm.auth_token {{your-api-key}} \
    && ocr config set llm.model claude-opus-4-6 \
    && ocr config set llm.use_anthropic true
```

**Verify Configuration:**
```bash
ocr llm test
```

### 03 Run Review
Start your first code review.

**Review Commands**
```bash
# Review current changes
ocr review

# Review diff between branches
ocr review --from main --to feature-auth

# Review a specific commit
ocr review --commit abc123

# Scan a specific directory using a global context file
ocr scan --path server/src -b .opencodereview/server/global_context.md
```

**Viwer**
```bash
ocr viewer
```

## Customizing Reviews

### The `.opencodereview` Folder

This folder is the central hub for customizing how the AI reviews your repository, add this to repo root and ocr will automatically recognise it for rules.json. Here you can place:
- **Global Context Files** (`global_context.md`): Broad architectural or domain knowledge the AI should know before reviewing anything.
- **Rules Configuration** (`rule.json`): Maps specific paths (like `server/**/*.controller.ts`) to specialized markdown rule files.
- **Rule Definitions** (`server/rules/*.md`, `client/rules/*.md`): The exact rules the AI uses when checking those specific file types.

### Configuring Rules (`rule.json`)

By default, the `rule.json` file in this folder maps file paths to specific review instructions. A typical configuration looks like this:

```json
{
  "rules": [
    {
      "path": "server/**/*.controller.ts",
      "rule": ".opencodereview/server/rules/controller_rules.md",
      "merge_system_rule": false
    },
    {
      "include": ["client/**/*.tsx", "client/**/*.ts"],
      "exclude": ["client/**/*.test.tsx"],
      "rule": ".opencodereview/client/rules/components_rules.md",
      "merge_system_rule": false
    }
  ]
}
```

- **`path`**: A single glob pattern specifying which files this rule applies to.
- **`include`**: An array of glob patterns for files to include (alternative to `path`).
- **`exclude`**: An array of glob patterns for files to explicitly ignore, even if they match `include` or `path`.
- **`rule`**: The path to a markdown file containing the instructions the AI must follow when reviewing those files.
- **`merge_system_rule`**: Whether to combine your custom instructions with the default OCR review rules (`true` or `false`).

You can edit this file to add new paths or change the mapped rule files based on your project's architectural needs.

### Previewing Rules

If you want to verify that your rules are being applied correctly without actually starting a code review, you can use the `rules check` command. This will show you exactly which review rules apply to a specific file and where they are coming from.

```bash
# Check which rules apply to a specific file
ocr rules check server/src/controller.ts
```

### Recommendations for Writing Rules and Global Context
Writing effective prompts for an AI code reviewer requires different strategies than standard chat prompting. Here is how you should design your `.opencodereview` files:
#### 1. The Global Context (`global_context.md`)
The global context should act as the "architectural brain" for the AI.
- **Define the Architecture:** Clearly explain the layers (e.g., Routes -> Controllers -> Services -> Models). You can even use Mermaid diagrams.
- **Set Directory Responsibilities:** Explicitly state what should and *should not* go in each folder. For example, "Controllers must not contain business logic; defer to Services."
- **List the API / Domain Map:** If applicable, map out how your domains connect so the AI understands cross-file boundaries.
- **Explicit AI Instructions:** End the document with strict guidelines for the AI (e.g., *"Note for AI Reviewer: Do not flag missing null-checks on `req.user` in Controllers if the route is protected by auth middleware"*).
#### 2. File-Specific Rules (`rules/*.md`)
Specific rules should be focused, strict, and calibrated to prevent AI hallucinations (nitpicking).
- **Allow for Zero Issues:** Start with a directive like *"CRITICAL DIRECTIVE: It is 100% acceptable to report 0 issues."* This stops the AI from generating useless feedback just to say something.
- **Chain of Thought (CoT):** Force the AI to think before it speaks. Provide a step-by-step reasoning checklist (e.g., *"1. Does this controller contain complex business logic? 2. Is it missing a try/catch? If no, conclude with 'No issues found'."*).
- **Few-Shot Calibration:** Give concrete code snippets of both "Clean Code" and "Buggy Code" along with the exact response you expect from the AI. This is the absolute most effective way to align the model's judgment with your team's standards.

for more info : https://open-codereview.ai