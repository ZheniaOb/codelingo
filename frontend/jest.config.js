module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-.*|unified|bail|is-plain-obj|trough|vfile|unist-.*|markdown-table|mdast-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|ccount|escape-string-regexp|trim-lines)/)',
  ],
  moduleNameMapper: {
    '^react-syntax-highlighter/dist/esm/(.*)$': 'react-syntax-highlighter/dist/cjs/$1',
  },
  testEnvironment: 'jsdom',
};
