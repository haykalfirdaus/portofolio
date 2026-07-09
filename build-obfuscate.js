#!/usr/bin/env node

/*! Build Script - Obfuscate, Minify, and Generate Production Assets */

const fs = require('fs');
const path = require('path');
const terser = require('terser');
const cssnano = require('cssnano');
const postcss = require('postcss');

const OUTPUT_DIR = path.join(__dirname, 'dist');

// ==================== HELPER FUNCTIONS ====================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function base64Encode(str) {
  return Buffer.from(str).toString('base64');
}

async function minifyJS(filePath, outputPath, options = {}) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const minified = await terser.minify(code, {
      compress: {
        passes: 2,
        unsafe: true,
        drop_console: true
      },
      mangle: {
        properties: false,
        keep_fnames: false
      },
      output: {
        beautify: false
      },
      ...options
    });

    if (minified.error) {
      console.error(`[ERROR] Minify ${filePath}:`, minified.error);
      return false;
    }

    fs.writeFileSync(outputPath, minified.code);
    console.log(`[OK] Minified: ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Minifying ${filePath}:`, err.message);
    return false;
  }
}

async function minifyCSS(filePath, outputPath) {
  try {
    const css = fs.readFileSync(filePath, 'utf-8');
    const result = await postcss([cssnano()]).process(css, { from: filePath });
    fs.writeFileSync(outputPath, result.css);
    console.log(`[OK] Minified: ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Minifying CSS ${filePath}:`, err.message);
    return false;
  }
}

function encodeHTML(filePath, outputPath) {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    const encoded = base64Encode(html);
    
    const decoderScript = `
(function(){
  const e="${encoded}";
  const d=atob(e);
  const h=new DOMParser().parseFromString(d,'text/html').body.innerHTML;
  document.documentElement.innerHTML=h;
})();
`.trim();

    fs.writeFileSync(outputPath, decoderScript);
    console.log(`[OK] Encoded HTML: ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Encoding HTML ${filePath}:`, err.message);
    return false;
  }
}

function encodeDataJSON(dataObj, outputPath) {
  try {
    const json = JSON.stringify(dataObj);
    const encoded = base64Encode(json);
    
    const script = `
window._SecureData.set('scheduleData', '${encoded}', 'b64');
window._SecureData.set('WA_NUMBER', '${base64Encode(dataObj.WA_NUMBER || '')}', 'b64');
`.trim();

    fs.writeFileSync(outputPath, script);
    console.log(`[OK] Encoded data: ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`[ERROR] Encoding data:`, err.message);
    return false;
  }
}

// ==================== MAIN BUILD PROCESS ====================

async function buildObfuscated() {
  console.log('\n=== STARTING OBFUSCATION BUILD ===\n');

  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, 'assets'));

  // 1. Minify & Obfuscate JavaScript
  console.log('Step 1: Obfuscating JavaScript...');
  const jsFiles = [
    { src: 'src/security-shield.js', out: path.join(OUTPUT_DIR, 'assets', 'security-shield.min.js') },
    { src: 'src/encoding-utils.js', out: path.join(OUTPUT_DIR, 'assets', 'encoding-utils.min.js') },
    { src: 'src/modules-obfuscated.js', out: path.join(OUTPUT_DIR, 'assets', 'modules.min.js') }
  ];

  for (const file of jsFiles) {
    const srcPath = path.join(__dirname, file.src);
    if (fs.existsSync(srcPath)) {
      await minifyJS(srcPath, file.out, {
        compress: {
          passes: 3,
          drop_console: true,
          pure_funcs: ['console.log', 'console.warn', 'console.error']
        }
      });
    } else {
      console.warn(`[WARN] File not found: ${srcPath}`);
    }
  }

  // 2. Minify CSS
  console.log('\nStep 2: Minifying CSS...');
  const srcCss = path.join(__dirname, 'src', 'style.css');
  const outCss = path.join(OUTPUT_DIR, 'assets', 'style.min.css');
  
  // For now, just copy and minify if exists
  if (fs.existsSync(srcCss)) {
    await minifyCSS(srcCss, outCss);
  } else {
    console.warn(`[WARN] CSS file not found: ${srcCss}`);
  }

  // 3. Encode sensitive data
  console.log('\nStep 3: Encoding sensitive data...');
  const sensitiveData = {
    WA_NUMBER: '628123731343',
    scheduleData: [
      { tanggal: '2026-04-08', nama_klien: 'aeroblast', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
      { tanggal: '2026-05-07', nama_klien: 'cloudsmp', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
      { tanggal: '2026-04-15', nama_klien: 'potatosmp', paket_layanan: 'Jasa Pembuatan Website', status: 'selesai' },
      { tanggal: '2026-02-02', nama_klien: 'aeoblast', paket_layanan: 'Jasa Pembuatan Website', status: 'selesai' },
      { tanggal: '2026-05-09', nama_klien: 'cloudsmp', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
      { tanggal: '2026-05-10', nama_klien: 'minervax', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
      { tanggal: '2026-05-31', nama_klien: 'renn3112', paket_layanan: 'Minecraft skin', status: 'selesai' }
    ]
  };
  
  encodeDataJSON(sensitiveData, path.join(OUTPUT_DIR, 'assets', 'secure-data.js'));

  // 4. Generate obfuscated index.html
  console.log('\nStep 4: Creating obfuscated HTML template...');
  const htmlTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Haykal Service - Portfolio</title>
  <link rel="stylesheet" href="assets/style.min.css">
  <script src="assets/encoding-utils.min.js"></script>
  <script src="assets/security-shield.min.js"></script>
</head>
<body>
  <div id="app"></div>
  <script src="assets/secure-data.js"></script>
  <script src="assets/modules.min.js"></script>
  <noscript>JavaScript is required to view this site.</noscript>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), htmlTemplate);
  console.log(`[OK] Generated: ${path.join(OUTPUT_DIR, 'index.html')}`);

  // 5. Generate build info
  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    obfuscation: {
      javascript: 'terser (mangle: true, compress: 3 passes)',
      css: 'cssnano',
      data: 'base64 encoding',
      devtools: 'blocked'
    },
    files: {
      js: jsFiles.map(f => f.out),
      css: [outCss],
      html: path.join(OUTPUT_DIR, 'index.html')
    }
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'BUILD_INFO.json'),
    JSON.stringify(buildInfo, null, 2)
  );

  console.log('\n[OK] Build info: ' + path.join(OUTPUT_DIR, 'BUILD_INFO.json'));
  console.log('\n=== BUILD COMPLETE ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log('All files are obfuscated and minified!');
}

// ==================== RUN BUILD ====================

buildObfuscated().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
