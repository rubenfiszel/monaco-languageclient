/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
// this is required syntax highlighting
import { whenReady as whenReadyJson } from '@codingame/monaco-vscode-json-default-extension';
import { disposeEditor, startEditor, swapEditors } from '../../common/example-apps-common.js';
import { UserConfig } from 'monaco-editor-wrapper';

const languageId = 'json';
let codeMain = `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": {"value": "windows"}
}`;
const codeOrg = `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": {"value": "unix"}
}`;

const userConfig: UserConfig = {
    wrapperConfig: {
        serviceConfig: {
            userServices: {
                ...getKeybindingsServiceOverride(),
            },
            debugLogging: true
        },
        editorAppConfig: {
            $type: 'extended',
            languageId: languageId,
            code: codeMain,
            useDiffEditor: false,
            codeOriginal: codeOrg,
            // Ensure all required extensions are loaded before setting up the language extension
            awaitExtensionReadiness: [whenReadyJson],
            userConfiguration: {
                json: JSON.stringify({
                    'workbench.colorTheme': 'Default Dark Modern',
                    'editor.guides.bracketPairsHorizontal': 'active',
                    'editor.lightbulb.enabled': 'On'
                })
            }
        }
    },
    languageClientConfig: {
        options: {
            $type: 'WebSocketUrl',
            url: 'ws://localhost:30000/sampleServer',
            startOptions: {
                onCall: () => {
                    console.log('Connected to socket.');
                },
                reportStatus: true
            },
            stopOptions: {
                onCall: () => {
                    console.log('Disconnected from socket.');
                },
                reportStatus: true
            }
        }
    }
};

try {
    const htmlElement = document.getElementById('monaco-editor-root');
    document.querySelector('#button-start')?.addEventListener('click', () => {
        startEditor(userConfig, htmlElement, codeMain, codeOrg);
    });
    document.querySelector('#button-swap')?.addEventListener('click', () => {
        swapEditors(userConfig, htmlElement, codeMain, codeOrg);
    });
    document.querySelector('#button-dispose')?.addEventListener('click', async () => {
        codeMain = await disposeEditor(userConfig.wrapperConfig.editorAppConfig.useDiffEditor);
    });

    startEditor(userConfig, htmlElement, codeMain, codeOrg);
} catch (e) {
    console.error(e);
}
