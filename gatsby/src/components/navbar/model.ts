export interface SubMenu extends MenuItem {
  style: string;
  items: MenuItem[];
}

export interface MenuItem {
  link: string;
  name: string;
}