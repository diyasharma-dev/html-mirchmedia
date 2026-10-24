const fs = require('fs');
const path = require('path');

// 1. Identify input directories
const dirs = fs.readdirSync('.').filter(f => fs.statSync(f).isDirectory() && f !== 'vendor' && f !== '.git');
console.log('Detected directories:', dirs);

const mainDir = dirs.find(d => d.includes('Home page') || d.includes('sample-html'));
const contactDir = dirs.find(d => d.includes('Contact'));
const serviceDir = dirs.find(d => d.includes('Service'));

if (!mainDir || !contactDir || !serviceDir) {
  console.error('Could not find all three directories:', { mainDir, contactDir, serviceDir });
  process.exit(1);
}

const mainPath = path.join(mainDir, 'Main.dc.html');
const contactPath = path.join(contactDir, 'Contact.dc.html');
const servicePath = path.join(serviceDir, 'Service.dc.html');

const mainRaw = fs.readFileSync(mainPath, 'utf8');
const contactRaw = fs.readFileSync(contactPath, 'utf8');
const serviceRaw = fs.readFileSync(servicePath, 'utf8');

function cleanHTML(raw, title) {
  const helmetMatch = raw.match(/<helmet>([\s\S]*?)<\/helmet>/);
  let helmetContent = helmetMatch ? helmetMatch[1].trim() : '';

  // Add smooth scroll
  helmetContent = helmetContent.replace('<style>', '<style>\nhtml{scroll-behavior:smooth}');

  const helmetEnd = raw.indexOf('</helmet>');
  const xdcEnd = raw.lastIndexOf('</x-dc>');

  let bodyContent = raw.slice(helmetEnd + 9, xdcEnd).trim();

  // Replace {{accent}} with #C8221A
  bodyContent = bodyContent.replace(/\{\{accent\}\}/g, '#C8221A');

  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${helmetContent}
</head>
<body>
${bodyContent}
</body>
</html>
`;

  return fullHtml;
}

function getUnifiedFooter(ctaHref) {
  return `<!-- FOOTER -->
<footer style="background: #0E1B3D; color: #C9CFDD">
  <div style="max-width: 1200px; margin: 0 auto; padding: 56px 24px 0; display: flex; flex-direction: column; gap: 48px">
    <div style="background: #C8221A; border-radius: 24px; padding: 40px; display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: center">
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em">Ready for a website that sells?</h2>
      <a href="${ctaHref}" style="text-decoration: none; background: #FFFFFF; color: #0E1B3D; padding: 18px 30px; border-radius: 999px; font-weight: 800; font-size: 17px">Get a Free Plan</a>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px; font-size: 15px; line-height: 2">
      <div>
        <div style="font-weight: 800; font-size: 20px; color: #FFFFFF; line-height: 1.4">Mirch Media</div>
        <p style="margin: 8px 0 0; line-height: 1.5">We grow local businesses. Since 2006.</p>
        <p style="margin: 12px 0 0; color: #FFFFFF; font-weight: 700; line-height: 1.5">★ 5.0 on Google</p>
      </div>
      <div>
        <div style="font-weight: 800; color: #FFFFFF">Services</div>
        <div><a href="services.html" style="color: inherit; text-decoration: none">Websites</a></div>
        <div>SEO &amp; Google Maps</div>
        <div>Ads</div>
        <div>Social Media &amp; Video</div>
        <div>Automation &amp; Virtual Staff</div>
      </div>
      <div>
        <div style="font-weight: 800; color: #FFFFFF">Company</div>
        <div>About</div>
        <div>Our Work</div>
        <div>Blog</div>
        <div>Careers</div>
        <div><a href="contact.html" style="color: inherit; text-decoration: none">Contact</a></div>
      </div>
      <div>
        <div style="font-weight: 800; color: #FFFFFF">Visit or call</div>
        <div style="line-height: 1.5; margin-top: 6px">108–14 72nd Ave<br>Forest Hills, NY 11375</div>
        <div style="margin-top: 6px"><a href="tel:+15169698550" style="color: inherit; text-decoration: none">(516) 969–8550</a></div>
        <div>Mon–Fri 9am–6pm</div>
      </div>
    </div>
    <div style="border-top: 1px solid #2A3757; padding: 24px 0; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 13px; color: #9AA3B8">
      <span>© 2026 Mirch Media Inc.</span>
      <span>Privacy · Terms · EN | ES</span>
    </div>
  </div>
</footer>`;
}

let indexHtml = cleanHTML(mainRaw, 'Mirch Media — We Grow Your Business');
let contactHtml = cleanHTML(contactRaw, 'Contact Mirch Media — Talk to a Real Person');
let serviceHtml = cleanHTML(serviceRaw, 'Websites Service — Mirch Media');

// ===== LINK REPLACEMENTS =====

// 1. In indexHtml (Home)
// Logo link
indexHtml = indexHtml.replace(
  '<a href="#" style="text-decoration: none; display: flex; align-items: center; gap: 10px">',
  '<a href="index.html" style="text-decoration: none; display: flex; align-items: center; gap: 10px">'
);
// Header nav Services link
indexHtml = indexHtml.replace(
  '<a href="#" style="text-decoration: none">Services ▾</a>',
  '<a href="services.html" style="text-decoration: none">Services ▾</a>'
);
// Header CTA
indexHtml = indexHtml.replace(
  '<a href="#" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 12px 20px; border-radius: 999px; font-weight: 700; font-size: 15px">Get a Free Plan</a>',
  '<a href="contact.html" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 12px 20px; border-radius: 999px; font-weight: 700; font-size: 15px">Get a Free Plan</a>'
);
// Hero CTA
indexHtml = indexHtml.replace(
  '<a href="#" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 18px 30px; border-radius: 999px; font-weight: 700; font-size: 17px">Get a Free Plan</a>',
  '<a href="contact.html" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 18px 30px; border-radius: 999px; font-weight: 700; font-size: 17px">Get a Free Plan</a>'
);
// Websites link in grid card
indexHtml = indexHtml.replace(
  '<a href="Service.dc.html" style="margin-top: auto; font-weight: 700; font-size: 15px">Websites →</a>',
  '<a href="services.html" style="margin-top: auto; font-weight: 700; font-size: 15px">Websites →</a>'
);
// Websites link in "Websites that bring in customers" section
indexHtml = indexHtml.replace(
  '<a href="Service.dc.html" style="align-self: flex-start; text-decoration: none; background: #0E1B3D; color: #FFFFFF; padding: 16px 26px; border-radius: 999px; font-weight: 700; font-size: 16px">See our websites</a>',
  '<a href="services.html" style="align-self: flex-start; text-decoration: none; background: #0E1B3D; color: #FFFFFF; padding: 16px 26px; border-radius: 999px; font-weight: 700; font-size: 16px">See our websites</a>'
);
// Replace Footer with exact requested unified footer
indexHtml = indexHtml.replace(/<footer[\s\S]*?<\/footer>/, getUnifiedFooter('contact.html'));

// 2. In serviceHtml (Services / Websites)
// Logo link
serviceHtml = serviceHtml.replace('href="Main.dc.html"', 'href="index.html"');
// Header nav Services link
serviceHtml = serviceHtml.replace(
  '<a href="#" style="text-decoration: none; color: #C8221A">Services ▾</a>',
  '<a href="services.html" style="text-decoration: none; color: #C8221A">Services ▾</a>'
);
// Header CTA
serviceHtml = serviceHtml.replace(
  '<a href="#" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 12px 20px; border-radius: 999px; font-weight: 700; font-size: 15px">Get a Free Plan</a>',
  '<a href="contact.html" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 12px 20px; border-radius: 999px; font-weight: 700; font-size: 15px">Get a Free Plan</a>'
);
// Breadcrumb
serviceHtml = serviceHtml.replace(
  '<a href="Main.dc.html">Home</a>',
  '<a href="index.html">Home</a>'
);
// Hero CTA
serviceHtml = serviceHtml.replace(
  '<a href="#" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 18px 30px; border-radius: 999px; font-weight: 700; font-size: 17px">Get a Free Plan</a>',
  '<a href="contact.html" style="text-decoration: none; background: #C8221A; color: #FFFFFF; padding: 18px 30px; border-radius: 999px; font-weight: 700; font-size: 17px">Get a Free Plan</a>'
);
// Get my quote
serviceHtml = serviceHtml.replace(
  '<a href="#" style="text-decoration: none; background: #0E1B3D; color: #FFFFFF; padding: 16px 26px; border-radius: 999px; font-weight: 700; font-size: 16px">Get my quote</a>',
  '<a href="contact.html" style="text-decoration: none; background: #0E1B3D; color: #FFFFFF; padding: 16px 26px; border-radius: 999px; font-weight: 700; font-size: 16px">Get my quote</a>'
);
// Replace Footer with exact requested unified footer
serviceHtml = serviceHtml.replace(/<footer[\s\S]*?<\/footer>/, getUnifiedFooter('contact.html'));

// 3. In contactHtml (Contact Us)
// Logo link
contactHtml = contactHtml.replace('href="Main.dc.html"', 'href="index.html"');
// Header nav Services link
contactHtml = contactHtml.replace('href="Service.dc.html"', 'href="services.html"');
// Replace Footer with exact requested unified footer (button jumps to #form on contact page)
contactHtml = contactHtml.replace(/<footer[\s\S]*?<\/footer>/, getUnifiedFooter('#form'));

// Output to root
fs.writeFileSync('index.html', indexHtml, 'utf8');
fs.writeFileSync('services.html', serviceHtml, 'utf8');
fs.writeFileSync('contact.html', contactHtml, 'utf8');

// Also create aliases
fs.writeFileSync('Main.html', indexHtml, 'utf8');
fs.writeFileSync('Service.html', serviceHtml, 'utf8');
fs.writeFileSync('Contact.html', contactHtml, 'utf8');

console.log('✅ Generated index.html, services.html, contact.html with unified footer matching user image!');
