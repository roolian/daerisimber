const plugin = require("tailwindcss/plugin");

export default {
    content: ["./vendor/daeris/daerisimber-library/views/**/*.twig", "./theme/views/**/*.twig", "./theme/blocks/**/*.twig", "./theme/modules/**/*.twig"],
    theme: {
        fontFamily: {
            display: ["Roboto", "Helvetica", "Arial", "sans-serif"],
            body: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        },
        screens: {
            sm: "480px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
        },
        container: {
          center: true,
          padding: {
              DEFAULT: "1.25rem",
              xl: "0",
          },
        },
        extend: {
            colors: {
                current: "currentColor",
                primary: "#007D8F",
                secondary: "#E22019",
                success: "#A0C81E",
                warning: "#E69441",
                error: "#E22019",
                information: "#007D8F",
            },
            fontSize: {
                xxs: ["0.625rem", "0.875rem"],
                xs: ["0.75rem", "1.375rem"],
                sm: ["0.875rem", "1.5rem"],
                base: ["1rem", "1.625rem"],
                18: ["1.125rem", "1.5rem"],
                20: ["1.25rem", "1.75rem"],
                22: ["1.375rem", "2rem"],
                24: ["1.5rem", "2rem"],
                26: ["1.625rem", "2.25rem"],
                28: ["1.75rem", "2rem"],
                32: ["2rem", "2.625rem"],
                38: ["2.375rem", "2.625rem"],
                40: ["2.5rem", "3.125rem"],
                46: ["2.875rem", "3.125rem"],
                48: ["3rem", "3.625rem"],
                54: ["3.375rem", "3.625rem"],
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
        plugin(function ({ addVariant }) {
            addVariant("group-active", ".group.active &");
        }),
    ],
};
