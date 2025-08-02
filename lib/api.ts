import type { Company } from './types';

function parseReadmeContent(content: string): Company[] {
  const lines = content.split('\n');
  const companies: Company[] = [];

  const relevantLines = lines.filter(
    (line) =>
      line.trim() &&
      !line.includes('===') &&
      !line.includes('Company Name | Office location')
  );

  let i = 0;
  while (i < relevantLines.length) {
    if (!relevantLines[i].startsWith('|')) {
      i++;
      continue;
    }

    const name = relevantLines[i].substring(1).trim();
    i++;
    if (i >= relevantLines.length) continue;

    let location = relevantLines[i].substring(1).trim();
    i++;
    while (i < relevantLines.length && !relevantLines[i].startsWith('|')) {
      location += ' ' + relevantLines[i].trim();
      i++;
    }

    let technologies: string[] = [];
    if (i < relevantLines.length && relevantLines[i].startsWith('|')) {
      technologies = relevantLines[i]
        .substring(1)
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);
      i++;
    }

    const websites: Company['websites'] = [];
    while (i < relevantLines.length) {
      const currentLine = relevantLines[i].trim();
      if (currentLine.startsWith('|') && !currentLine.includes('http')) {
        break;
      }

      const textToParse = currentLine.startsWith('|')
        ? currentLine.substring(1)
        : currentLine;
      const matches = [
        ...textToParse.matchAll(/(https?:\/\/[^\[]+)\[([^\]]+)\]/g),
      ];

      for (const match of matches) {
        websites.push({ url: match[1], label: match[2] });
      }
      i++;
    }

    if (name) {
      companies.push({
        name,
        location: location,
        technologies,
        websites,
      });
    }
  }
  return companies;
}

export async function fetchCompaniesData(): Promise<Company[]> {
  const GITHUB_RAW_URL =
    'https://raw.githubusercontent.com/Chy-Zaber-Bin-Zahid/Tech-Companies-in-Bangladesh/main/README.adoc';

  try {
    const res = await fetch(GITHUB_RAW_URL, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    const content = await res.text();

    const companies = parseReadmeContent(content);
    return companies;
  } catch (error) {
    console.error('Error fetching companies data:', error);
    throw error;
  }
}
