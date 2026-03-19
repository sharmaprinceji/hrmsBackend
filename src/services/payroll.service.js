import puppeteer from "puppeteer";

export const generatePayslip = async (payroll) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = `
    <h1>Salary Slip</h1>
    <p>Employee: ${payroll.name}</p>
    <p>Month: ${payroll.payroll_month}</p>
    <p>Net Salary: ${payroll.net_salary}</p>
`;

    await page.setContent(html);

    const pdf = await page.pdf({
        format: "A4"
    });

    await browser.close();

    return pdf;
}