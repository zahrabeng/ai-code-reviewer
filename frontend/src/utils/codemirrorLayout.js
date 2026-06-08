import { EditorView } from '@codemirror/view';

export const fillEditorTheme = EditorView.theme({
  '&': {
    height: '100%',
    maxHeight: '100%',
  },
  '.cm-scroller': {
    overflow: 'auto',
    height: '100%',
    maxHeight: '100%',
  },
});
