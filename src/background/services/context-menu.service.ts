export function CreateContextMenus(): void {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'block-element-picker',
      title: 'Block this element',
      contexts: ['all']
    });
  });
}
