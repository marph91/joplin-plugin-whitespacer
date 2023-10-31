const overlays = [
  {
    name: "whitespaces",
    token: function (stream) {
      if (stream.next() === " ") {
        console.log(this.togglingLabel);
        this.togglingLabel = !this.togglingLabel;
        return `whitespace-${this.togglingLabel ? "a" : "b"}`;
      }
    },
    // We need two separate classes for consecutive space characters.
    // Else all spaces after the first one are ignored (not sure why).
    togglingLabel: false,
  },
  {
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
  },
];

module.exports = {
  default: function (_context) {
    return {
      plugin: function (CodeMirror) {
        CodeMirror.defineOption("enableWhitespacer", false, (cm, val, prev) => {
          if (prev === CodeMirror.Init) prev = false;
          if (prev && !val)
            for (let overlay of overlays) cm.removeOverlay(overlay);

          if (!prev && val) {
            const enabledOverlays = ["whitespaces", "trailingspaces"];
            for (let overlay of overlays)
              if (enabledOverlays.includes(overlay.name))
                cm.addOverlay(overlay);
          }
        });
      },
      codeMirrorResources: [],
      codeMirrorOptions: { enableWhitespacer: true },
      assets: function () {
        return [{ name: "whitespacer.css" }];
      },
    };
  },
};
