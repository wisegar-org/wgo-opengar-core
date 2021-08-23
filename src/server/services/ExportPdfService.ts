import puppeteer, { PDFOptions } from 'puppeteer';
import { ReadStream } from 'fs';
import { Readable } from 'stream';

export async function exportHTMLToPdf(content: string, config: PDFOptions, callback: (doc: ReadStream) => any | undefined) {
  //create browser
  const browser = await puppeteer.launch();
  //set page content
  const page = await browser.newPage();
  await page.setContent(content);
  //generate pdf, return Buffer
  const pdfBuffer = await page.pdf(config);
  await browser.close();

  if (callback) {
    //convert buffer in ReadStream to load callback function
    const readable = new Readable();
    readable._read = () => {};
    readable.push(pdfBuffer);
    readable.push(null);
    callback(readable as any);
  }

  return pdfBuffer;
}
