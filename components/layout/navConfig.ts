import {
  LayoutDashboard,
  Users,
  Warehouse,
  MapPin,
  Archive,
  Layers,
  Package,
  Upload,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  pageName: string;
  tileLabel?: string; // solo cuando el tile necesita salto de línea
};

export const NAV_MAIN: NavItem[] = [
  { label: 'Dashboard',    href: '/',             icon: LayoutDashboard, pageName: 'Inicio'        },
  { label: 'Owners',       href: '/owners',        icon: Users,           pageName: 'Owners'        },
  { label: 'Bodegas',      href: '/warehouses',    icon: Warehouse,       pageName: 'Bodegas'       },
  { label: 'Ubicaciones',  href: '/locations',     icon: MapPin,          pageName: 'Ubicaciones'   },
  { label: 'Productos',    href: '/products',      icon: Package,         pageName: 'Productos'     },
  { label: 'Contenedores', href: '/containers',    icon: Archive,         pageName: 'Contenedores'  },
  { label: 'Lotes',        href: '/lots',          icon: Layers,          pageName: 'Lotes'         },
];

export const NAV_OPERATIONS: NavItem[] = [
  { label: 'Carga Masiva', href: '/products/bulk-upload', icon: Upload, pageName: 'Carga Masiva', tileLabel: 'Carga\nMasiva' },
];
