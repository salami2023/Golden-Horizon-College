import React from 'react';
import { X, Check, Palette, Layout, Type, Sun, Moon, Sparkles, RefreshCw } from 'lucide-react';
import { SchoolThemeConfig } from '../types';

interface CustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolThemeConfig;
  onChangeConfig: (newConfig: SchoolThemeConfig) => void;
}

export const ThemeCustomizerModal: React.FC<CustomizerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  if (!isOpen) return null;

  const primaryColors = [
    { name: 'Emerald Green', hex: '#10b981', class: 'bg-emerald-600' },
    { name: 'Royal Blue', hex: '#2563eb', class: 'bg-blue-600' },
    { name: 'Indigo Deep', hex: '#4f46e5', class: 'bg-indigo-600' },
    { name: 'Violet Purple', hex: '#7c3aed', class: 'bg-purple-600' },
    { name: 'Teal Modern', hex: '#0d9488', class: 'bg-teal-600' },
    { name: 'Crimson Red', hex: '#dc2626', class: 'bg-red-600' }
  ];

  const fontOptions: SchoolThemeConfig['fontFamily'][] = [
    'Plus Jakarta Sans',
    'Inter',
    'Poppins',
    'Roboto'
  ];

  const resetToDefault = () => {
    onChangeConfig({
      mode: 'light',
      primaryColor: '#10b981',
      headerColor: 'white',
      sidebarColor: '#0f172a',
      layoutMode: 'vertical',
      sidebarStyle: 'full',
      fontFamily: 'Plus Jakarta Sans',
      containerWidth: 'wide'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                KwikSchools Portal Customizer
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Personalize layout, color theme & typography
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          
          {/* Theme Mode Toggle (Light / Dark) */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 mb-2 block flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-500" /> Interface Appearance
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onChangeConfig({ ...config, mode: 'light' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold transition ${
                  config.mode === 'light'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" /> Light Mode
                {config.mode === 'light' && <Check className="h-4 w-4 text-emerald-600 ml-auto" />}
              </button>

              <button
                onClick={() => onChangeConfig({ ...config, mode: 'dark' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold transition ${
                  config.mode === 'dark'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" /> Dark Mode
                {config.mode === 'dark' && <Check className="h-4 w-4 text-emerald-600 ml-auto" />}
              </button>
            </div>
          </div>

          {/* Primary Accent Color Selector */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 mb-2 block flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-emerald-600" /> Primary School Accent Color
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {primaryColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onChangeConfig({ ...config, primaryColor: c.hex })}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left font-medium transition ${
                    config.primaryColor === c.hex
                      ? 'border-slate-900 dark:border-white ring-2 ring-emerald-500/30 font-bold bg-slate-50 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full ${c.class} shrink-0 shadow-sm`} />
                  <span className="truncate text-[11px] text-slate-700 dark:text-slate-200">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selection */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 mb-2 block flex items-center gap-1.5">
              <Type className="h-4 w-4 text-blue-600" /> Dashboard Typography Font
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {fontOptions.map((font) => (
                <button
                  key={font}
                  onClick={() => onChangeConfig({ ...config, fontFamily: font })}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                    config.fontFamily === font
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Container Width */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 mb-2 block flex items-center gap-1.5">
              <Layout className="h-4 w-4 text-purple-600" /> Container Layout Width
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onChangeConfig({ ...config, containerWidth: 'wide' })}
                className={`p-2.5 rounded-xl border font-semibold text-center transition ${
                  config.containerWidth === 'wide'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                Wide (Full Fluid Width)
              </button>
              <button
                onClick={() => onChangeConfig({ ...config, containerWidth: 'boxed' })}
                className={`p-2.5 rounded-xl border font-semibold text-center transition ${
                  config.containerWidth === 'boxed'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                Boxed (Centered Max 1280px)
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            Apply & Save
          </button>
        </div>

      </div>
    </div>
  );
};
