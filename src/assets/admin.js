import theme from "./../../theme.json";

if (window.acf) {
    window.acf.add_filter("color_picker_args", (args, field) => {
        args.palettes = theme.settings.color.palette.map((color) => color.color);
        return args;
    });
}
