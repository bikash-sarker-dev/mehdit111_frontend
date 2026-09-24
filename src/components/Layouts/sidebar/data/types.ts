export interface NavSubItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface NavItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
  items: NavSubItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}
