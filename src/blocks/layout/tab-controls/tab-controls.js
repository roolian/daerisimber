import Alpine from "alpinejs";

// Initialize dynamic block preview (editor).
if (window.acf) {
    window.acf.addAction("render_block_preview/type=daeris/tab-controls", () => {});
}

document.addEventListener("alpine:init", () => {
    Alpine.store("tabStore", {
        data: {},
    });

    Alpine.data("tabControls", (groupid = "default", defaultTab = "default") => ({
        init() {
            this.$store.tabStore.data[groupid] = { activeTab: defaultTab, controls: [] };
        },
        setActive(tabId) {
            this.$store.tabStore.data[groupid].activeTab = tabId;
        },
        isActive(tabId) {
            return this.$store.tabStore.data[groupid].activeTab == tabId;
        },
        setNext() {
            const tabs = Array.from(document.querySelectorAll(`[x-data="tabControls('${groupid}', '${defaultTab}')"] button`));
            const currentIndex = tabs.findIndex((tab) => this.isActive(tab.getAttribute("x-on:click").match(/setActive\('(.+)'\)/)[1]));
            const nextIndex = (currentIndex + 1) % tabs.length;
            const nextTabId = tabs[nextIndex].getAttribute("x-on:click").match(/setActive\('(.+)'\)/)[1];
            this.setActive(nextTabId);
        },
        setPrevious() {
            const tabs = Array.from(document.querySelectorAll(`[x-data="tabControls('${groupid}', '${defaultTab}')"] button`));
            const currentIndex = tabs.findIndex((tab) => this.isActive(tab.getAttribute("x-on:click").match(/setActive\('(.+)'\)/)[1]));
            const previousIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            const previousTabId = tabs[previousIndex].getAttribute("x-on:click").match(/setActive\('(.+)'\)/)[1];
            this.setActive(previousTabId);
        },
        pushControl(tabId, tabTitle) {
            this.$store.tabStore.data[groupid].controls.push({ id: tabId, title: tabTitle });
        },
        get currentTab() {
            return this.$store.tabStore.data[groupid].activeTab;
        },
    }));
});
