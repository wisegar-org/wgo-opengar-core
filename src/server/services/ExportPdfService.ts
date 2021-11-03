import puppeteer, { BrowserConnectOptions, BrowserLaunchArgumentOptions, LaunchOptions, PDFOptions, Product } from 'puppeteer';
import { ReadStream } from 'fs-extra';
import { Readable } from 'stream';

export type ConfigLaunch = LaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions & {
    product?: Product;
    extraPrefsFirefox?: Record<string, unknown>;
  };

export async function exportHTMLToPdfBuffer(
  content: string,
  config: PDFOptions,
  configLaunch: ConfigLaunch = { ignoreDefaultArgs: ['--disable-extensions'] }
): Promise<Buffer> {
  //create browser
  const browser = await puppeteer.launch(configLaunch);
  //set page content
  const page = await browser.newPage();
  await page.setContent(content);
  //generate pdf, return Buffer
  const pdfBuffer = await page.pdf(config);
  await browser.close();
  return pdfBuffer;
}

export async function exportHTMLToPdfReadStream(
  content: string,
  config: PDFOptions,
  configLaunch: ConfigLaunch = { ignoreDefaultArgs: ['--disable-extensions'] }
): Promise<ReadStream> {
  const pdfBuffer = await exportHTMLToPdfBuffer(content, config, configLaunch);
  const readable = new Readable();
  readable._read = () => {};
  readable.push(pdfBuffer);
  readable.push(null);
  return readable as ReadStream;
}
