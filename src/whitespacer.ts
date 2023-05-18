module.exports = {
  default: function (_context) {
    return {
      plugin: function (CodeMirror) {
        let selections = [];

        function anchorHeadToStartStop(anchor, head) {
          if (anchor.line < head.line) {
            return [anchor, head];
          } else if (anchor.line < head.line) {
            return [head, anchor];
          }
          // same line
          else if (anchor.ch < head.ch) {
            return [anchor, head];
          } else {
            return [head, anchor];
          }
        }

        function between(currentPosition, anchor, head) {
          let [start, stop] = anchorHeadToStartStop(anchor, head);

          if (
            currentPosition.line > start.line &&
            currentPosition.line < stop.line
          ) {
            return true;
          } else if (
            currentPosition.line === start.line &&
            currentPosition.ch >= start.char
          ) {
            return true;
          } else if (
            currentPosition.line === stop.line &&
            currentPosition.ch < stop.char
          ) {
            return true;
          } else {
            return false;
          }
        }

        // function onSelectionChange(cm, { ranges, origin, update }) {
        function onSelectionChange(cm) {
          // console.log(cm.listSelections());
          // console.log(ranges);
          // for (const range of ranges) {
          //   console.log(range.anchor, range.head, range.anchor > range.head);
          // }
          // reset marks
          cm.getAllMarks().forEach((marker) => marker.clear());
          cm.removeLineClass(1, "wrap", "show-line-end");
          var start = cm.getCursor("start"),
            end = cm.getCursor("end");
          console.log(start, end);
          // selections = ranges;
          // let start = { line: 2, ch: 2 };
          // let end = { line: 4, ch: 2 };
          cm.addLineClass(1, "wrap", "show-line-end");
          cm.markText(start, end, {
            className: "selected",
          });

          // getAllMarks -> reset
        }

        CodeMirror.defineOption("showWhitespaces", false, (cm, val, prev) => {
          if (prev === CodeMirror.Init) prev = false;
          if (prev && !val) cm.removeOverlay("whitespaces");

          // We need two separate classes for consecutive space characters.
          // Else all spaces after the first one are ignored (not sure why).
          let togglingLabel = false;

          if (!prev && val) {
            // cm.on("beforeSelectionChange", onSelectionChange);
            cm.on("cursorActivity", onSelectionChange);

            for (
              let lineNumber = 0;
              lineNumber <= cm.lineCount();
              lineNumber++
            ) {
              cm.addLineClass(lineNumber, "wrap", "show-all-whitespace");
            }

            cm.addOverlay({
              name: "whitespaces",
              token: function nextToken(stream, state) {
                let classes = "";

                console.log(
                  stream.column(),
                  stream.lineOracle.line,
                  selections
                );

                if (stream.next() === " ") {
                  togglingLabel = !togglingLabel;
                  classes += `whitespace-${togglingLabel ? "a" : "b"}`;
                }

                // const isSelected = selections.some((selection) => {
                //   return between(
                //     { line: stream.lineOracle.line, ch: stream.column() },
                //     selection.anchor,
                //     selection.head
                //   );
                // });

                // if (!isSelected) {
                //   classes += " not-selected";
                // }
                return classes ? classes : null;
              },
            });
          }
        });
      },
      codeMirrorResources: [],
      codeMirrorOptions: { showWhitespaces: true },
      assets: function () {
        return [{ name: "whitespace.css" }];
      },
    };
  },
};
