import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true,
        async setupNodeEvents(on, config) {
            // implement node event listeners here
            const codeCoverageTask = await import('@cypress/code-coverage/task');
            codeCoverageTask.default(on, config);
            return config;
        },
    },
});
