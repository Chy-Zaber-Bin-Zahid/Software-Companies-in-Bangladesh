import type { Company } from "./types"

// Mock data based on the table structure you provided
const mockCompanies: Company[] = [
  {
    name: "Adplay Technologies (VU Mobile)",
    location: "Head Office: 4th Floor, House- 114, Road-12, Block-E, Banani, Dhaka-1213",
    technologies: ["JavaScript", "React", "WordPress"],
    website: "https://adplay.com",
    engineers: "Please update",
  },
  {
    name: "Adventure Dhaka Limited",
    location: "Head Office: Autograph Tower, 67-68, Kemal Ataturk Avenue, Banani, 17th & 8th Floor, Dhaka, Dhaka 1213",
    technologies: ["Golang", "JAVA", "Swift", "Flutter", "Javascript", "React", "NextJS", "DevOps"],
    website: "https://adventure.com",
    engineers: "Please update",
  },
  {
    name: "All Generation tech",
    location: "54 A 132 Road, Dhaka 1212",
    technologies: ["C#", "dotnet", "Python", "Go", "MongoDB", "Docker", "Azure", "Unqork"],
    website: "https://allgentech.com",
    engineers: 100,
  },
  {
    name: "Anchorblock Technology",
    location: "Block C House, 57 Rd Number 4, Dhaka 1213",
    technologies: [
      "JavaScript",
      "Python",
      "ReactJS",
      "NodeJS",
      "NestJS",
      "Django",
      "Hyperledger Fabric",
      "Flutter",
      "Android",
      "Solidity",
      "Smart Contact",
      "Machine Learning",
      "AWS",
    ],
    website: "https://anchorblock.com",
    engineers: "Please update",
  },
  {
    name: "Apex DMIT",
    location: "Catharsis Tower, (6th Floor) House #133, Road #12, Block-E, Banani, Dhaka, 1213",
    technologies: ["PHP", "JavaScript", "Python", "Flutter"],
    website: "https://apexdmit.com",
    engineers: "Please update",
  },
  {
    name: "Appnap",
    location: "Ranks Business Center (5th Floor), Ka-218/1, Progoti Sarani, Kuril, Dhaka 1229",
    technologies: ["iOS"],
    website: "https://appnap.com",
    engineers: "Please update",
  },
]

export async function fetchCompaniesData(): Promise<Company[]> {
  try {
    // In a real implementation, you would fetch from the GitHub API
    // const response = await fetch('https://api.github.com/repos/MBSTUPC/tech-companies-in-bangladesh/contents/README.md')
    // const data = await response.json()
    // const content = atob(data.content)
    // Parse the markdown content and extract company data

    // For now, return mock data with a delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return mockCompanies
  } catch (error) {
    console.error("Error fetching companies data:", error)
    // Return mock data as fallback
    return mockCompanies
  }
}

// Function to parse README content (you would implement this based on the actual format)
export function parseReadmeContent(content: string): Company[] {
  // This would parse the markdown table and extract company information
  // Implementation depends on the exact format of the README
  return mockCompanies
}
