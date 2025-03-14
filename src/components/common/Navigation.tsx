'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Bell, FileText } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    {
      href: '/notices',
      label: '공지사항',
      icon: FileText,
    },
    {
      href: '/uploads',
      label: '업로드 내역',
      icon: Bell,
    },
  ];

  return (
    <nav className="flex h-14 items-center border-b bg-background px-4 lg:px-6">
      <div className="flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          한밭모 SNS 자동화
        </Link>
        <div className="h-6 w-px bg-muted" />
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 