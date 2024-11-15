export class NoPageInitializedError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'Page is not initialized';
        this.description = 'Page is not initialized. Ensure to call analyzer.initialize().';
    }
}
//# sourceMappingURL=errors.js.map