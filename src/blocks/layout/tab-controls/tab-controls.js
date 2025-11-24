import Alpine from "alpinejs";

// Initialize dynamic block preview (editor).
if (window.acf) {
    window.acf.addAction("render_block_preview/type=daeris/tab-controls", () => {
        
    });
}

document.addEventListener("alpine:init", () => {
    
    Alpine.store("tabStore", {
        data: {},
    });

    Alpine.data("tabControls", (groupid = "default", defaultTab = "default") => ({
        init() {
            this.$store.tabStore.data[groupid] = defaultTab;
        },
        setActive(tabId) {
            this.$store.tabStore.data[groupid] = tabId;
        },
        isActive(tabId) {
            return this.$store.tabStore.data[groupid] == tabId;
        },
        get currentTab() {
            return this.$store.tabStore.data[groupid]
        }
    }));

});
