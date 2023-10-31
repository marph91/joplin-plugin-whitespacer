module.exports = {
  default: function (_context) {
    return {
      plugin: function (CodeMirror) {
        CodeMirror.defineOption("showWhitespaces", false, (cm, val, prev) => {
          if (prev === CodeMirror.Init) prev = false;
          if (prev && !val) cm.removeOverlay("whitespaces");

          // We need two separate classes for consecutive space characters.
          // Else all spaces after the first one are ignored (not sure why).
          let togglingLabel = false;

          if (!prev && val) {
            cm.addOverlay({
              name: "whitespaces",
              token: function (stream) {
                if (stream.next() === " ") {
                  togglingLabel = !togglingLabel;
                  return `whitespace-${togglingLabel ? "a" : "b"}`;
                }
              },
            });

            cm.addOverlay({
              name: "trailingspaces",
              token: function (stream) {
                const stringLengthWithoutTrailingWhitespaces =
                  stream.string.trimEnd().length;

                if (stringLengthWithoutTrailingWhitespaces > stream.pos) {
                  // advance to last char that isn't whitespace
                  stream.pos = stringLengthWithoutTrailingWhitespaces;
                  return null;
                }
                // rest of the stream are trailing spaces
                stream.pos++;
                return "trailingspace";
              },
            });
          }
        });
      },
      codeMirrorResources: [],
      codeMirrorOptions: { showWhitespaces: true },
      assets: function () {
        return [{ name: "whitespacer.css" }];
      },
    };
  },
};
