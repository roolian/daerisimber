import { themeColors, tailwindColors } from "./theme/theme-colors";

export default {
  theme: {
    extend: {
      //Edit theme-colors.js
      colors: { ...themeColors, ...tailwindColors },
    },
  },
};
