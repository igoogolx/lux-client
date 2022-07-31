module.exports = {
  root:true,
  extends: ["airbnb-typescript-prettier"],
  rules: {
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies":"off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
