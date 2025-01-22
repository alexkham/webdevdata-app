// themes.js
import { BookOpen, Sparkles, Zap, Shield, Check, Star, ArrowRight, Circle } from 'lucide-react';

export const themes = {
  modern: {
    name: 'Modern Card',
    styles: {
      backgroundColor: '#f8f9fa',
      textColor: '#2d3748',
      iconColor: '#48bb78',
      shadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  gradient: {
    name: 'Gradient',
    styles: {
      backgroundColor: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
      textColor: '#ffffff',
      iconColor: '#ffd700',
      itemBackground: 'rgba(255,255,255,0.1)',
      itemHoverBackground: 'rgba(255,255,255,0.15)'
    }
  },
  timeline: {
    name: 'Timeline',
    styles: {
      backgroundColor: '#eff6ff',
      textColor: '#1e3a8a',
      iconColor: '#3b82f6',
      borderColor: '#93c5fd',
      itemBackground: '#ffffff'
    }
  },
  floating: {
    name: 'Floating Cards',
    styles: {
      backgroundColor: 'linear-gradient(to right, #14b8a6, #059669)',
      textColor: '#ffffff',
      iconColor: '#14b8a6',
      itemBackground: '#ffffff',
      itemTextColor: '#374151'
    }
  },
  hexagonal: {
    name: 'Hexagonal',
    styles: {
      backgroundColor: '#fefce8',
      textColor: '#713f12',
      iconColor: '#ca8a04',
      itemBackground: '#ffffff',
      borderColor: '#facc15',
      pattern: 'radial-gradient(#000 1px,transparent 1px)'
    }
  },
  glassmorphic: {
    name: 'Glassmorphic Dark',
    styles: {
      backgroundColor: '#111827',
      textColor: '#ffffff',
      iconColor: '#a855f7',
      itemBackground: 'rgba(255,255,255,0.05)',
      itemBorder: 'rgba(255,255,255,0.1)',
      itemHoverBackground: 'rgba(255,255,255,0.08)'
    }
  },
  stacked: {
    name: 'Stacked Cards',
    styles: {
      backgroundColor: 'linear-gradient(135deg, #e0f2fe, #e0e7ff)',
      textColor: '#312e81',
      iconColor: '#6366f1',
      itemBackground: '#ffffff',
      itemShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  },
  neumorphic: {
    name: 'Neumorphic',
    styles: {
      backgroundColor: '#f1f5f9',
      textColor: '#1e293b',
      iconColor: '#475569',
      itemShadow: 'inset -12px -12px 24px #ffffff, inset 12px 12px 24px #d1d1d1'
    }
  }
};

export const defaultTheme = 'modern';