import "./styles/main.css";
import.meta.glob("../blocks/**/*.css", { eager: true });
import Alpine from "alpinejs";
import theme from "./../theme.json";

window.Alpine = Alpine;

window.parseAlpineTags = function (root = document) {
    const copyAttrs = (from, to) => Array.from(from.attributes).forEach((node) => to.setAttributeNode(node.cloneNode(true)));
    NodeList.prototype.forEach = Array.prototype.forEach;
    var items = root.querySelectorAll("[x-for]");
    for (const item of items) {
        var newElement = document.createElement("template");
        item.childNodes.forEach(function (elmt) {
            var cln = elmt.cloneNode(true);
            newElement.content.append(cln);
        });
        copyAttrs(item, newElement);
        item.replaceWith(newElement);
    }
};

if (window.acf) {
    window.acf.addAction("render_block_preview", (block) => {
        window.parseAlpineTags(block[0]);
    });

    window.acf.add_filter("color_picker_args", (args, field) => {
        args.palettes = theme.settings.color.palette.map(color => color.color);

        // return
        return args;
    });
}

document.addEventListener("alpine:init", () => {
    //window.parseAlpineTags();
});

import.meta.glob("../blocks/**/*.js", { eager: true });

window.Alpine.start();
