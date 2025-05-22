import { QuartzEmitterPlugin } from "../types"
import { defaultHead } from "../../components/Head"
import { Footer } from "../../components/Footer"
import { BodyConstructor } from "../../layouts"
import { NotFound } from "../../components/pages/404"
import { renderPage } from "../renderPage"
import { write } from "../write"
import { defaultProcessedContent } from "../../util/defaultProcessedContent"
import { pageResources } from "../pageResources"
import { DepGraph } from "graphlib"
import { FullSlug, FilePath } from "../types"

export const NotFoundPage: QuartzEmitterPlugin = () => {
  const opts = {
    head: defaultHead,
    pageBody: NotFound(),
    footer: Footer,
    beforeBody: [],
    left: [],
    right: [],
  }

  const { head: Head, pageBody, footer: FooterComp } = opts
  const Body = BodyConstructor()

  return {
    name: "404Page",
    getQuartzComponents() {
      return [Head, Body, pageBody, FooterComp]
    },
    async getDependencyGraph() {
      return new DepGraph<FilePath>()
    },
    async emit(ctx, _content, resources): Promise<FilePath[]> {
      const cfg = ctx.cfg.configuration
      const slug = "404" as FullSlug

      const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
      const path = url.pathname as FullSlug
      const externalResources = pageResources(path, resources)

      const notFound = "Page Not Found"
      const [tree, vfile] = defaultProcessedContent({
        slug,
        text: notFound,
        description: notFound,
        frontmatter: { title: notFound, tags: [] },
      })

      const componentData = {
        ctx,
        fileData: vfile.data,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles: [],
      }

      return [
        await write({
          ctx,
          content: renderPage(cfg, slug, componentData, opts, externalResources),
          slug,
          ext: ".html",
        }),
      ]
    },
  }
}
