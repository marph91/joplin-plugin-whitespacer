import joplin from "api";
import { ContentScriptType, SettingItemType } from "api/types";

const contentScriptId = "whitespacer";

joplin.plugins.register({
  onStart: async function () {
    await joplin.settings.registerSettings({
      whiteSpaceMode: {
        value: "allWhitespaces",
        isEnum: true,
        type: SettingItemType.String,
        section: "whitespacerSection",
        label: "Show Whitespaces",
        public: true,
        options: {
          allWhitespaces: "All Whitespaces",
          trailingWhitespaces: "Trailing Whitespaces Only",
        },
      },
    });

    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      contentScriptId,
      "./whitespacer.js"
    );

    await joplin.contentScripts.onMessage(
      contentScriptId,
      async (message: { function: string; name: string }) => {
        if (message.function === "getSetting") {
          return await joplin.settings.value(message.name);
        } else {
          console.info("Invalid function", message.function);
        }
      }
    );
  },
});
