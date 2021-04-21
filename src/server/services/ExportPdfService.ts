import { create, CreateResult, CreateOptions } from 'html-pdf'
import { ReadStream } from 'node:fs'
export { CreateOptions } from 'html-pdf'

export async function exportHTMLToPdf(
  content: string,
  config: CreateOptions,
  callback: (doc: ReadStream) => void
) {
  const pdf: CreateResult = create(content, config)
  pdf.toStream(function (err: Error, res: ReadStream) {
    if (err) {
      console.log(err)
    } else {
      callback(res)
    }
  })
}
