import "./styles/main.css";
import.meta.glob("../blocks/**/*.css", { eager: true });
import Alpine from "alpinejs";


window.Alpine = Alpine;

window.parseAlpineTags = function(root = document) {
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
}

if (window.acf) {
   
    window.acf.addAction("render_block_preview", (block) => {
        console.log('render_block_preview')
        window.parseAlpineTags(block[0]);
    });
}

document.addEventListener("alpine:init", () => {
    //window.parseAlpineTags();
});

import.meta.glob("../blocks/**/*.js", { eager: true });


window.Alpine.start();
