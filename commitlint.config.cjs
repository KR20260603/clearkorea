module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-empty": [2, "never"],
    "footer-empty": [2, "never"],
    "footer-leading-blank": [2, "always"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"]
    ],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "test", "docs", "chore", "build", "ci", "perf"]
    ]
  },
};
