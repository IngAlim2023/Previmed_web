import { defineConfig } from "cypress";

export default defineConfig({
/*   video: true,
  videosFolder: "cypress/videos", 
 */
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
