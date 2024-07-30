import colors from "./theme-colors";


const colorPalette = [];

const reduceColors = (entries) => {
    for (const [key, value] of Object.entries(colors)) {
        if (typeof value == "object") {
            reduceColors(value)
        } else {
            colorPalette.push({
                name : key,
                slug : key,
                color : value,
            })
        }
    }
}

reduceColors(colors);



const themeConfig = {
    version: 2,
    settings: {
        layout: {
            contentSize: "100%",
            wideSize: "1024px",
            fullSize: "1280px",
        },
        color: {
            custom: false,
            customGradient: false,
            defaultPalette: false,
            gradients: [],
            defaultGradients: false,
            palette: colorPalette
        },
        typography: {
            customFontSize: false,
            dropCap: false,
            fontWeight: false,
            fontStyle: false,
            textTransform: false,
            textDecoration: false,
        },
    },
    styles: {},
};

export default themeConfig;
