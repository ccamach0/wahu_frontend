#!/usr/bin/env node

/**
 * Script para monitorear el despliegue del frontend en Cloudflare Pages
 * Verifica periódicamente si hay un nuevo buildTime
 *
 * Uso: node monitor-deployment.js [previousBuildTime] [interval]
 */

const EXPECTED_BUILD_TIME = process.argv[2];
const CHECK_INTERVAL = parseInt(process.argv[3]) || 15000; // 15 segundos
const FRONTEND_URL = 'https://wahu-2ih.pages.dev';

let checkCount = 0;
let lastBuildTime = null;

function extractBuildTime(html) {
  // Buscar __BUILD_TIME__ en el HTML/JS
  const match = html.match(/__BUILD_TIME__["\']?\s*:\s*["\']([^"\']+)["\']/);
  if (match) return match[1];

  // Alternativa: buscar en window.__buildTime
  const match2 = html.match(/window\.__buildTime\s*=\s*["\']([^"\']+)["\']/);
  if (match2) return match2[1];

  return null;
}

async function checkDeployment() {
  checkCount++;

  try {
    const response = await fetch(`${FRONTEND_URL}/?_timestamp=${Date.now()}`);
    const html = await response.text();
    const buildTime = extractBuildTime(html);
    const timestamp = new Date().toLocaleTimeString();

    if (buildTime && buildTime !== lastBuildTime) {
      console.log(`[${timestamp}] Frontend buildTime: ${buildTime}`);
      lastBuildTime = buildTime;

      // Verificar si es el esperado
      if (EXPECTED_BUILD_TIME && buildTime === EXPECTED_BUILD_TIME) {
        console.log('\n✅ ✅ ✅ DESPLIEGUE COMPLETADO (Frontend) ✅ ✅ ✅');
        console.log(`Expected: ${EXPECTED_BUILD_TIME}`);
        console.log(`Current:  ${buildTime}`);
        console.log(`Checks:   ${checkCount}`);
        process.exit(0);
      }
    } else if (!buildTime) {
      console.log(`[${timestamp}] ⏳ Esperando despliegue... (Check ${checkCount})`);
    }
  } catch (err) {
    console.log(`[${new Date().toLocaleTimeString()}] ⏳ Esperando despliegue... (Check ${checkCount})`);
  }
}

console.log('🔍 Monitoreando despliegue del frontend...');
console.log(`📍 URL: ${FRONTEND_URL}`);
console.log(`⏱️  Intervalo: ${CHECK_INTERVAL}ms`);
if (EXPECTED_BUILD_TIME) {
  console.log(`🎯 BuildTime esperado: ${EXPECTED_BUILD_TIME}`);
}
console.log('---');

// Primer check inmediato
checkDeployment();

// Checks posteriores
const interval = setInterval(checkDeployment, CHECK_INTERVAL);

// Timeout después de 10 minutos
setTimeout(() => {
  clearInterval(interval);
  console.log('\n⚠️  Timeout: El despliegue no se completó en 10 minutos');
  process.exit(1);
}, 10 * 60 * 1000);
