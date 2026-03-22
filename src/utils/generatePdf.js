// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";
import { payslipTemplate } from "./paySlipTemplates.js";
import puppeteer from "puppeteer";

export const createPdf = async () => {
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    const html = payslipTemplate(payroll);

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
        format: "A4",
    });

    await browser.close();

    return pdf;
};

export const generatePaySlip = async () => {
    // ✅ FIXED (NO executablePath)
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    const html = payslipTemplate(payroll);

    await page.setContent(html, {
        waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    return pdf;
};

