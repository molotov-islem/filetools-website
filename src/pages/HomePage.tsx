import React from 'react';
import { Link } from 'react-router-dom';
import { Merge, Split, Zap, RefreshCw, Image, Shield, Lock, Eye, Award } from 'lucide-react';

export function HomePage() {
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document with custom ordering',
      icon: Merge,
      path: '/merge',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Extract specific pages or split PDF into multiple documents',
      icon: Split,
      path: '/split',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce file size while maintaining quality with smart compression',
      icon: Zap,
      path: '/compress',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      id: 'convert',
      title: 'Convert Files',
      description: 'Convert PDFs to images, Word docs, or create PDFs from images',
      icon: RefreshCw,
      path: '/convert',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'reorder',
      title: 'Reorder Pages',
      description: 'Rearrange or delete PDF pages with visual thumbnail preview',
      icon: Image,
      path: '/reorder',
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700'
    },
    {
      id: 'protect',
      title: 'Protect PDF',
      description: 'Add password protection or remove existing passwords',
      icon: Shield,
      path: '/protect',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    }
  ];

  const features = [
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your files are processed securely and automatically deleted after 24 hours'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Client-side processing for instant results without uploading when possible'
    },
    {
      icon: Eye,
      title: 'No Registration',
      description: 'Use all basic tools immediately without creating an account'
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Industry-standard PDF processing with enterprise-grade reliability'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional PDF Tools
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Fast & Private
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform, merge, split, and optimize your PDF files with our suite of professional tools. 
              Privacy-focused processing with instant results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/merge"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                View All Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your PDF Tool
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade PDF processing tools designed for speed, security, and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} ${tool.hoverColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      <span>Try it now</span>
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FileTool?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with privacy, speed, and professional results in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                    <IconComponent className="h-8 w-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your PDFs?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of professionals who trust FileTool for their PDF processing needs.
            </p>
            <Link
              to="/merge"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Processing PDFs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/Plan de travail 2.png" 
                alt="FileTool Logo" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">FileTool</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 FileTool. Professional PDF tools for everyone.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}