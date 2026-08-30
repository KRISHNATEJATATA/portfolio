import fs from 'node:fs';
import path from 'node:path';

const htmlDir = path.join(process.cwd(), 'diagrams', 'html');

const darkFiles = [
  'kafka-event-pipeline.dark.html',
  'scalable-ecommerce-backend.dark.html',
  'aws-etl.dark.html'
];

for (const darkFile of darkFiles) {
  const darkPath = path.join(htmlDir, darkFile);
  const lightFile = darkFile.replace('.dark.html', '.light.html');
  const lightPath = path.join(htmlDir, lightFile);

  let content = fs.readFileSync(darkPath, 'utf8');

  // Title / comment replacements
  content = content.replaceAll('(dark)', '(light)');
  content = content.replaceAll('-dark-', '-light-');

  // Token replacements in CSS
  content = content.replaceAll('#0a0a0b', '#f7f5f0');
  content = content.replaceAll('#131315', '#efede6');
  content = content.replaceAll('#f4f1ea', '#1c1b18');
  content = content.replaceAll('#a8a29e', '#6f6a60');
  content = content.replaceAll('#f59e0b', '#b45309');

  // RGBA replacements in SVG
  content = content.replaceAll('rgba(244,241,234,', 'rgba(28,27,24,');
  content = content.replaceAll('rgba(168,162,158,', 'rgba(111,106,96,');
  content = content.replaceAll('rgba(245,158,11,', 'rgba(180,83,9,');

  fs.writeFileSync(lightPath, content, 'utf8');
  console.log(`Generated ${lightFile}`);
}
