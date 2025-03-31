"use client";

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../context/TranslationContext';
import { useAuth } from '../../context/AuthContext';
import type { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { signOut } from '../../features/auth';
import { useToast } from "../../components/ui/use-toast";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationProps {
  items?: NavItem[];
}

export default function Navigation({ items }: NavigationProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultItems: NavItem[] = [
    { label: t('nav.dashboard'), href: '/dashboard' },
    { label: t('nav.routes'), href: '/routes' },
    { label: t('nav.calendar'), href: '/calendar' },
    { label: t('nav.settings'), href: '/settings' },
  ];

  const navItems = items || defaultItems;

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await dispatch(signOut());
      toast({
        title: t('auth.signOutSuccess'),
        duration: 3000,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: t('auth.signOutError'),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-secondary transition-colors ${
                pathname === item.href ? 'text-secondary font-bold' : ''
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm">
              {t('nav.welcome')}, {user.username}
            </span>
          )}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? t('auth.signingOut') : t('auth.signOut')}
          </button>
        </div>
      </div>
    </nav>
  );
} 