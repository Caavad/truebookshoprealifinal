export interface NavBarProps {
  id: string; // ✅ раньше было number
  name: string;
  category?: string;
  description: string;
  items: {
    id: string;
    title: string;
    href: string;
    description: string;
  }[];
}
