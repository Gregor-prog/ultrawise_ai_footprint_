'use client';

import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Wrench,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  {
    href: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/anomalies',
    icon: AlertTriangle,
    label: 'Anomalies',
  },
  // {
  //   href: '/maintenance',
  //   icon: Wrench,
  //   label: 'Maintenance',
  // },
  {
    href: '/optimizations',
    icon: Lightbulb,
    label: 'Optimizations',
  },
  {
    href: '/reports',
    icon: FileText,
    label: 'Reports',
  },
];

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

const AppSidebar: FC = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='fixed'>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-4">
          <Logo className="w-8 h-8" style={{ filter: "brightness(0) invert(1)" }} />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight font-headline">
              Ultrawise
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior={false}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt="User"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Jane Doe</span>
            <span className="text-xs text-muted-foreground">
              jane.doe@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const Header: FC = () => {
  const { isMobile } = useSidebar();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="relative ml-auto flex-1 md:grow-0"></div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt="User"
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <SidebarInset className="flex flex-col sm:gap-4 sm:py-4">
          <Header />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
