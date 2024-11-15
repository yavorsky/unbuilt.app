export class NoPageInitializedError extends Error {
  name = 'Page is not initialized'
  description = 'Page is not initialized. Ensure to call analyzer.initialize().'
}