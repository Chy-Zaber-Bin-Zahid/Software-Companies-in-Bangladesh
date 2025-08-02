export interface Company {
  name: string;
  location: string;
  technologies: string[];
  websites: {
    url: string;
    label: string;
  }[];
}
