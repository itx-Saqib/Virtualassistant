const puppeteer = require("puppeteer");

let browser = null;

const getWhatsAppPage = async () => {
  try {
    // Existing Chrome se connect karo
    if (!browser) {
      browser = await puppeteer.connect({
        browserURL: "http://127.0.0.1:9222",
        defaultViewport: null,
      });

      browser.on("disconnected", () => {
        browser = null;
      });
    }

    // Existing Chrome tabs check karo
    const pages = await browser.pages();

    let page = pages.find((p) =>
      p.url().includes("web.whatsapp.com")
    );

    // Agar WhatsApp tab nahi hai to naya tab open karo
    if (!page) {
      page = await browser.newPage();
      await page.goto("https://web.whatsapp.com/", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    }

    // WhatsApp load hone ka wait
    await page.waitForFunction(
      () => {
        return (
          location.hostname === "web.whatsapp.com" &&
          document.readyState !== "loading"
        );
      },
      { timeout: 60000 }
    );

    console.log("WhatsApp URL:", page.url());
    console.log("WhatsApp Title:", await page.title());

    return page;
  } catch (error) {
    console.error("WhatsApp connection error:", error.message);

    throw new Error(
      "WhatsApp load nahi hua. Chrome mein WhatsApp Web open karo aur login check karo."
    );
  }
};







const searchContact = async (page, contactName) => {
  console.log("Current URL:", page.url());
  console.log("Page title:", await page.title());

  // Page aur frames inspect karo
  const frames = page.frames();

  for (const frame of frames) {
    try {
      const info = await frame.evaluate(() => ({
        url: location.href,
        title: document.title,
        bodyText: document.body?.innerText?.slice(0, 500) || "",
        readyState: document.readyState,
        inputCount: document.querySelectorAll(
          'input, [contenteditable="true"], [role="textbox"]'
        ).length,
      }));

      console.log("Frame diagnostics:", info);
    } catch (error) {
      console.log(
        "Frame inspect error:",
        frame.url(),
        error.message
      );
    }
  }

  // Is test mein message send nahi hoga

};







const openWhatsAppAndSearch = async (contactName) => {
  if (!contactName?.trim()) {
    throw new Error("Contact name is required.");
  }

  const page = await getWhatsAppPage();

  await searchContact(page, contactName.trim());

  return {
    success: true,
    contactName: contactName.trim(),
    message: `${contactName} ki chat open ho gayi hai.`,
  };
};

const sendWhatsAppMessage = async (contactName, message) => {
  if (!contactName?.trim() || !message?.trim()) {
    throw new Error(
      "Contact name aur message dono required hain."
    );
  }

  const page = await getWhatsAppPage();

  await searchContact(page, contactName.trim());

  const composerSelector =
    'footer [contenteditable="true"]';

const fields = await page.evaluate(() => {
  return [
    ...document.querySelectorAll(
      'input, [contenteditable="true"], [role="textbox"]'
    ),
  ].map((el) => ({
    tag: el.tagName,
    type: el.getAttribute("type"),
    ariaLabel: el.getAttribute("aria-label"),
    placeholder: el.getAttribute("placeholder"),
    dataTab: el.getAttribute("data-tab"),
    role: el.getAttribute("role"),
    outerHTML: el.outerHTML.slice(0, 400),
  }));
});

console.log("WhatsApp fields:", fields);

const input = await page.$(
  'input[aria-label="Search or start a new chat"]'
);

if (!input) {
  throw new Error("WhatsApp contact search input nahi mila.");
}
// WhatsApp chat open hone ke baad run karo
const composerInfo = await page.evaluate(() => {
  return Array.from(
    document.querySelectorAll('[contenteditable="true"]')
  ).map((element) => ({
    tag: element.tagName,
    ariaLabel: element.getAttribute("aria-label"),
    title: element.getAttribute("title"),
    role: element.getAttribute("role"),
    dataTab: element.getAttribute("data-tab"),
    outerHTML: element.outerHTML.slice(0, 500),
  }));
});

console.log("WhatsApp composers:", composerInfo);

  // Message send karne se pehle confirm karo ke sahi chat khuli hai.
  const chatTitle = await page.evaluate(() => {
    const header = document.querySelector("header");
    return header?.innerText?.trim() || "";
  });

  if (
    !chatTitle.toLowerCase().includes(
      contactName.trim().toLowerCase()
    )
  ) {
    throw new Error(
      "Opened chat ka naam match nahi hua. Message send nahi kiya."
    );
  }

  await page.keyboard.press("Enter");

  return {
    success: true,
    contactName: contactName.trim(),
    message: "Message send action execute ho gaya; delivery independently verify nahi hui.",
  };
};

module.exports = {
  openWhatsAppAndSearch,
  sendWhatsAppMessage,
};

