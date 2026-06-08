import { EditorState } from '@codemirror/state';

export const maxLengthExtension = (max) =>
  EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged) return tr;
    return tr.newDoc.length <= max ? tr : [];
  });
