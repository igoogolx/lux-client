module.exports = {
  root: true,
  extends: ["airbnb-typescript-prettier"],
  plugins: ["import"],
  rules: {
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events":"off",
    "react/jsx-props-no-spreading": "off",
    "no-param-reassign": "off",
    "react/require-default-props": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "error",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ]
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        "project": "./tsconfig.json"

      }
    }
  }
};
