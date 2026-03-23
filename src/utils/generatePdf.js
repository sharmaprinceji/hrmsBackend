import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { payslipTemplate } from "./paySlipTemplates.js";

/**
 * ✅ OPTION 1: Puppeteer (simple - works locally, may fail on Render)
 */
export const generatePdfWithPuppeteer = async (html) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdf;
};

/**
 * ✅ OPTION 2: Serverless Chromium (BEST for Render / Vercel)
 */
export const generatePdfWithChromium = async (html) => {
  const browser = await puppeteerCore.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process"
    ],
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return pdf;
};


export const generatePayslipPdf = async (payroll, type = "chromium") => {
  const html = payslipTemplate(payroll);

  if (type === "puppeteer") {
    return generatePdfWithPuppeteer(html);
  }

  if (type === "chromium") {
    return generatePdfWithChromium(html);
  }

  throw new Error("Invalid PDF generator type");
};