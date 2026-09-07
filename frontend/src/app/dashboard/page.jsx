'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PlaceholderPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-2">
          <Clock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          This module is part of the upcoming phased development roadmap and will be activated in the next phase.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
