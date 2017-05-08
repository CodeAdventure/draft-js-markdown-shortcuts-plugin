import changeCurrentInlineStyle from './changeCurrentInlineStyle';

const inlineMatchers = {
  BOLD: [
    /\*\*([\s\S]+?)\*\*(?!\*)/g,
//  -> not used in favor of underline
//  /__([^(?:__)]+)__/g
  ],
  ITALIC: [
    /[^*|^]\*([^*]+)\*(?!\*)/g,
    /[^_|^]_([^_]+)_(?!_)/g
  ],
  UNDERLINE: [
    /__([^(?:__)]+)__/g,
  ],
  // CODE: [
  //   /`([^`]+)`/g
  // ],
  // STRIKETHROUGH: [
  //   /~~([^(?:~~)]+)~~/g
  // ]
};

const handleInlineStyle = (editorState) => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();

  let newEditorState = editorState;
  Object.keys(inlineMatchers).some((k) => {
    inlineMatchers[k].some((re) => {
      let matchArr;
      do {
        matchArr = re.exec(text);
        if (matchArr) {
          if (k === 'ITALIC') {
            // Since JS has no lookbehind regex capabilities we need this
            // hack to cleanup the matches of italic styles :(
            matchArr[0] = matchArr[0].slice(1);
            matchArr.index += 1;
          }
          newEditorState = changeCurrentInlineStyle(newEditorState, matchArr, k);
        }
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });
  return newEditorState;
};

export default handleInlineStyle;
