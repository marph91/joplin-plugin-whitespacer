import joplin from "api";
import { ContentScriptType } from "api/types";

const contentScriptId = "whitespacer";

joplin.plugins.register({
  onStart: async function () {
    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      contentScriptId,
      "./whitespacer.js"
    );
  },
});
