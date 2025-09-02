export function removeTabFromStorage(id) {
    localStorage.removeItem(`mizu_coder_tab_${id}_content`);
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    const filtered = savedTabs.filter(tab => tab.id !== id);
    localStorage.setItem('mizu_coder_tabs', JSON.stringify(filtered));
}
