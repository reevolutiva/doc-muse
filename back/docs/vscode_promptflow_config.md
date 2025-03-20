# Prompt flow for VS Code

![Microsoft](https://img.shields.io/badge/Microsoft-Official-blue)
![Installs](https://img.shields.io/badge/Installs-69%2C206-brightgreen)
![Rating](https://img.shields.io/badge/Rating-4%2F5-yellow)
![License](https://img.shields.io/badge/License-Free-green)

## Overview

Prompt flow is a VS Code extension by Microsoft that helps you develop, test and evaluate Large Language Model (LLM) applications.

**Official Documentation:** [https://microsoft.github.io/promptflow/](https://microsoft.github.io/promptflow/)

## Quick Start

### Prerequisites

- [VSCode Python extension](https://code.visualstudio.com/docs/languages/python)
- Python environment (Python 3.9 recommended). [Reference](https://code.visualstudio.com/docs/languages/python#_environments)
- Install the promptflow Python SDK: [Setup Guide](https://microsoft.github.io/promptflow/how-to-guides/quick-start.html#set-up-your-dev-environment)

### Keyboard Shortcuts

- `Ctrl/Cmd + N`: Add a new node on current flow
- `Ctrl/Cmd + K`, then `V` on "flow.dag.yaml" YAML editor: Open the visual editor with GUI support and visualization
- `F5` on "flow.dag.yaml": Trigger flow debug with debugging mode for Python tools
- `Shift + F5` on "flow.dag.yaml": Trigger flow tests
- `Ctrl/Cmd + S` on "create/update_{ConnectionType}_connection.yaml": Trigger connection creation

### Install Dependencies

**Prerequisites:**
- VSCode Python extension installed
- Python environment selected for your work

For detailed instructions, check [Python in VS Code](https://code.visualstudio.com/docs/languages/python).

Make sure `promptflow` and `promptflow-tools` are installed correctly in your working environment.

You can find the "Install dependencies" entry on the VS Code primary side bar > Prompt flow pivot > Quick access.

### Create Connections

1. Find your connections list on: VS Code primary side bar > Prompt flow pivot > Connections section
2. Right-click on the plus icon on the top right
3. Follow the instructions in the YAML template and use code lens actions to create your connections

### Create Your First Flow

1. Create a new working directory for your flow
2. Right-click the directory in VS Code explorer and select "New flow in this directory" to initialize your first flow
   - Alternatively, use the "Create new flow" action
3. Open the "flow.dag.yaml" file in your new flow to begin authoring
4. For visual editing, use the "Visual editor" action from the top code lens actions

## Web and Remote Support

Please note that this extension only supports local development. It does not provide web (vscode.dev) or remote support at this time.

## Privacy and Telemetry

The Prompt flow extension collects usage data and sends it to Microsoft to help improve the product. Microsoft respects your privacy and provides transparency about data collection practices in their privacy statement. Learn more at [Visual Studio Code - Telemetry](https://code.visualstudio.com/docs/getstarted/telemetry).

## Additional Information

- **Categories**: Machine Learning
- **Tags**: keybindings, llm, prompt, prompt-flow, prompty
- **Compatible With**: Universal
- **Version**: 1.21.138799792
- **Released**: August 31, 2023
- **Last Updated**: August 27, 2024
- **Publisher**: Microsoft
- **Identifier**: prompt-flow.prompt-flow

---

© 2025 Microsoft | [Contact us](https://support.microsoft.com/contactus) | [Jobs](https://careers.microsoft.com/) | [Privacy](https://privacy.microsoft.com/privacystatement) | [Terms of Use](https://www.microsoft.com/legal/terms-of-use) | [Trademarks](https://www.microsoft.com/legal/intellectualproperty/trademarks)