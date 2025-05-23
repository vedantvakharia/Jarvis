import { QuartzEmitterPlugin } from "../types"
import NotFound from "../../components/pages/404"

export const NotFoundPage: QuartzEmitterPlugin = () => {
  return {
    name: "404Page",
    getQuartzComponents() {
      return [NotFound()]
    },
    async getDependencyGraph() {
      return null // or empty graph if required
    },
    async emit(ctx) {
      const content = `<html><body><h1>404 - Page Not Found</h1></body></html>`
      const slug = "404"
      return [
        // Provide a basic file write operation or however your build system expects output
        // If 'write' utility missing, you may need to implement a simple file write here
      ]
    },
  }
}
