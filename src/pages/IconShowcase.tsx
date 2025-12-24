import React, { useState } from 'react';
import TYTIcon, { NavbarIcon, DashboardIcon } from '../components/icons';
import type { IconName, IconSize } from '../components/icons';

/**
 * Icon Showcase Page
 *
 * Demo page to test all TYT icons with different states and sizes
 * Route: /icon-showcase (dev only)
 */
export default function IconShowcase() {
  const [activeIcon, setActiveIcon] = useState<IconName>('home');

  const icons: IconName[] = [
    'home',
    'wallet',
    'token',
    'marketplace',
    'mining',
    'staking',
    'governance',
    'ai',
    'security',
    'foundation'
  ];

  const sizes: IconSize[] = ['sm', 'md', 'lg', 'xl'];

  return (
    <div className="min-h-screen bg-owl-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-owl-gradient bg-clip-text text-transparent mb-4">
            TYT Icon System v1.0
          </h1>
          <p className="text-gray-400">
            Cyberpunk web icon system with CSS animations
          </p>
        </header>

        {/* Size Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Size Variants</h2>
          <div className="grid grid-cols-4 gap-8">
            {sizes.map((size) => (
              <div key={size} className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <TYTIcon name="mining" size={size} />
                </div>
                <p className="text-sm text-gray-400 uppercase font-mono">{size}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {size === 'sm' && '20×20'}
                  {size === 'md' && '24×24'}
                  {size === 'lg' && '32×32'}
                  {size === 'xl' && '48×48'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* All Icons Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Icon Inventory (Hover to Test)</h2>
          <div className="grid grid-cols-5 gap-6">
            {icons.map((name) => (
              <div
                key={name}
                className="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => setActiveIcon(name)}
              >
                <div className="mb-3 flex justify-center">
                  <TYTIcon name={name} size="lg" active={activeIcon === name} />
                </div>
                <p className="text-sm text-gray-300 font-medium">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Navbar Simulation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Navbar Simulation</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2">
              {icons.slice(0, 6).map((name) => (
                <button
                  key={name}
                  onClick={() => setActiveIcon(name)}
                  className="p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <NavbarIcon name={name} active={activeIcon === name} />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* States */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Icon States</h2>
          <div className="grid grid-cols-4 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TYTIcon name="wallet" size="lg" />
              </div>
              <p className="text-sm text-gray-300 font-medium">Default</p>
              <p className="text-xs text-gray-600 mt-1">opacity: 0.9</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TYTIcon name="wallet" size="lg" active />
              </div>
              <p className="text-sm text-gray-300 font-medium">Active</p>
              <p className="text-xs text-gray-600 mt-1">glow + scale</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TYTIcon name="ai" size="lg" pulse />
              </div>
              <p className="text-sm text-gray-300 font-medium">Pulse</p>
              <p className="text-xs text-gray-600 mt-1">animated glow</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TYTIcon name="wallet" size="lg" disabled />
              </div>
              <p className="text-sm text-gray-300 font-medium">Disabled</p>
              <p className="text-xs text-gray-600 mt-1">grayscale</p>
            </div>
          </div>
        </section>

        {/* Special Effects */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Special Effects</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="mb-4 flex justify-center">
                <TYTIcon name="ai" size="xl" pulse />
              </div>
              <p className="text-sm text-gray-300 font-medium mb-2">AI Icon</p>
              <p className="text-xs text-gray-600">Use with pulse for living effect</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="mb-4 flex justify-center">
                <TYTIcon name="security" size="xl" pulse />
              </div>
              <p className="text-sm text-gray-300 font-medium mb-2">Security Icon</p>
              <p className="text-xs text-gray-600">Pulse indicates active monitoring</p>
            </div>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Dashboard Card Examples</h2>
          <div className="grid grid-cols-3 gap-6">
            {['staking', 'mining', 'governance'].map((name) => (
              <div key={name} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DashboardIcon name={name as IconName} />
                  <h3 className="text-lg font-semibold text-white capitalize">{name}</h3>
                </div>
                <p className="text-sm text-gray-400">
                  This is a dashboard card with a {name} icon
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Design Tokens */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Design Tokens</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Colors</h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded" style={{ background: '#E6C15A' }}></div>
                    <span className="text-gray-400">--gold-500: #E6C15A</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded" style={{ background: '#CFAE4C' }}></div>
                    <span className="text-gray-400">--gold-600: #CFAE4C</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded" style={{ background: '#B88CFF' }}></div>
                    <span className="text-gray-400">--neon-purple: #B88CFF</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded" style={{ background: '#7AD7FF' }}></div>
                    <span className="text-gray-400">--neon-blue: #7AD7FF</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Animations</h3>
                <div className="space-y-2 text-xs text-gray-400">
                  <div>Hover: translateY(-1px) + glow</div>
                  <div>Active: scale(1.06) + strong glow</div>
                  <div>Pulse: 2.4s ease-in-out infinite</div>
                  <div>Transition: 0.25s ease</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gold-400 mb-6">Code Examples</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-2">Basic Usage</p>
              <code className="text-sm text-cyan-400 font-mono">
                {'<TYTIcon name="wallet" size="md" />'}
              </code>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-2">Navbar Icon</p>
              <code className="text-sm text-cyan-400 font-mono">
                {'<NavbarIcon name="mining" active={isActive} />'}
              </code>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-xs text-gray-500 mb-2">With Pulse</p>
              <code className="text-sm text-cyan-400 font-mono">
                {'<TYTIcon name="ai" pulse />'}
              </code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
