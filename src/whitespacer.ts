module.exports = {
  default: function (_context) {
    return {
      plugin: function (CodeMirror) {
        CodeMirror.defineOption("showWhitespaces", false, (cm, val, prev) => {
          if (prev === CodeMirror.Init) prev = false;
          if (prev && !val) cm.removeOverlay("whitespaces");

          // We need two separate classes for consecutive space characters.
          // Else all spaces after the first one are ignored (not sure why).
          let togglingLabelSpace = false;
          let togglingLabelTab = false;

          if (!prev && val) {
            cm.addOverlay({
              name: "whitespaces",
              token: function nextToken(stream) {
                switch (stream.next()) {
                  case " ":
                    togglingLabelSpace = !togglingLabelSpace;
                    return `space-${togglingLabelSpace ? "a" : "b"}`;
                  case "\t":
                    togglingLabelTab = !togglingLabelTab;
                    return `tab-${togglingLabelTab ? "a" : "b"}`;
                }
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
