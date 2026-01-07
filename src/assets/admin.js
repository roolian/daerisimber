import theme from "./../../theme.json";

    console.log(1245787899)
if (window.acf) {
    console.log(4546)
    window.acf.add_filter("color_picker_args", (args, field) => {
        args.palettes = theme.settings.color.palette.map((color) => color.color);
        return args;
    });
}
