import Alpine from "alpinejs";

// Initialize dynamic block preview (editor).
if (window.acf) {
    window.acf.addAction("render_block_preview/type=daeris/tab-content", () => {
        
    });
}

document.addEventListener("alpine:init", () => {
    Alpine.data("tabContent", (groupid = "default") => ({
        isActive(tabId) {
            return this.$store.tabStore.data[groupid] == tabId;
        },
        setActive(tabId) {
            this.$store.tabStore.data[groupid] = tabId;
        },
    }));
});
