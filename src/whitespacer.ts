const overlays = [
  {
    name: "allWhitespaces",
    token: function (stream) {
      const nextCharacter = stream.next();
      if (nextCharacter === " ") {
        this.togglingLabel = !this.togglingLabel;
        return `ws-whitespace-${this.togglingLabel ? "a" : "b"}`;
      } else if (nextCharacter === "	") {
        // TODO: why doesn't "\t" work?
        return "ws-whitespace-tab";
      }
    },
    // We need two separate classes for consecutive space characters.
    // Else all spaces after the first one are ignored (not sure why).
    togglingLabel: false,
  },
  {
    name: "trailingWhitespaces",
    token: function (stream) {
      const stringLengthWithoutTrailingWhitespaces =
        stream.string.trimEnd().length;

      if (stringLengthWithoutTrailingWhitespaces > stream.pos) {
        // advance to last char that isn't whitespace
        stream.pos = stringLengthWithoutTrailingWhitespaces;
        return null;
      }
      // rest of the stream are trailing spaces
      const nextCharacter = stream.next();
      if (nextCharacter === " ") {
        this.togglingLabel = !this.togglingLabel;
        return `ws-trailingspace-${this.togglingLabel ? "a" : "b"}`;
      } else if (nextCharacter === "	") {
        return "ws-trailingspace-tab";
      }
    },
    togglingLabel: false,
  },
];

module.exports = {
  default: function (context) {
    return {
      plugin: function (CodeMirror) {
        CodeMirror.defineOption("enableWhitespacer", false, (cm, val, prev) => {
          if (prev === CodeMirror.Init) prev = false;
          if (prev && !val)
            for (let overlay of overlays) cm.removeOverlay(overlay);

          if (!prev && val) {
            async function getSetting(timeout: number, name: string) {
              const enabledOverlay = await context.postMessage({
                function: "getSetting",
                name: "whiteSpaceMode",
              });

              if (enabledOverlay) {
                for (let overlay of overlays)
                  if (overlay.name === enabledOverlay) cm.addOverlay(overlay);
              } else {
                setTimeout(getSetting, timeout * 2, name);
              }
            }

            // Wait until the settings are available.
            setTimeout(getSetting, 100, "whiteSpaceMode");
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
