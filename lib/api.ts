import type { Company } from "./types"

/**
 * Parses the string content of the Readme.adoc file into an array of Company objects.
 * This version handles companies with multiple website links on separate lines.
 * @param content The raw string content of the .adoc file.
 * @returns An array of Company objects.
 */
function parseReadmeContent(content: string): Company[] {
  const lines = content.split('\n');
  const companies: Company[] = [];
  // Filter for lines that are part of the table, excluding the start/end markers and the header.
  const tableLines = lines.filter(line => line.trim().startsWith('|') && !line.includes('===') && !line.includes('Company Name'));

  let i = 0;
  while (i < tableLines.length) {
    // A company entry must have at least a name, location, and tech line.
    if (i + 2 >= tableLines.length) break;

    const name = tableLines[i]?.substring(1).trim();
    const location = tableLines[i + 1]?.substring(1).trim();
    const technologies = tableLines[i + 2]?.substring(1).split(',').map(tech => tech.trim()).filter(Boolean);
    
    // After getting the main info, advance the index.
    i += 3;

    const websites: Company['websites'] = [];
    
    // Now, loop through subsequent lines to find all associated web links.
    // A line is considered a web link if it contains the AsciiDoc link format.
    while (i < tableLines.length && tableLines[i].includes('http')) {
      const websiteLine = tableLines[i];
      const websiteMatches = [...websiteLine.matchAll(/(https?:\/\/[^\[]+)\[([^\]]+)\]/g)];
      
      for (const match of websiteMatches) {
        websites.push({
          url: match[1],
          label: match[2],
        });
      }
      i++;
    }


    if (name) {
      companies.push({
        name,
        location,
        technologies,
        websites,
      });
    }
  }
  return companies;
}


/**
 * Fetches the company data directly from the raw GitHub Readme.adoc file.
 * This function is called directly from the client-side component.
 */
export async function fetchCompaniesData(): Promise<Company[]> {
  const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Chy-Zaber-Bin-Zahid/Software-Companies-in-Bangladesh/main/README.adoc'

  try {
    const res = await fetch(GITHUB_RAW_URL)

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    const content = await res.text()

    const companies = parseReadmeContent(content)
    console.log("Successfully parsed companies:", companies.length, companies)
    return companies
  } catch (error) {
    console.error("Error fetching companies data:", error)
    throw error;
  }
}
