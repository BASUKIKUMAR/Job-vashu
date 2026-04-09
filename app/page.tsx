'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Job {
  id: number;
  title: string;
  category: string;
  postDate: string;
  lastDate: string;
  applyLink: string;
  sourceWebsite: string;
  createdAt: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [activeCategory, search, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?category=${activeCategory}&search=${search}&page=${page}`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
        setTotalPages(Math.ceil(data.total / 20));
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Job', 'Result', 'Admit Card'];

  const renderJobCard = (job: Job) => {
    const isNew = new Date(job.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;

    return (
      <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
            ${job.category === 'Job' ? 'bg-blue-100 text-blue-800' : 
              job.category === 'Result' ? 'bg-green-100 text-green-800' : 
              'bg-purple-100 text-purple-800'}`}>
            {job.category}
          </span>
          {isNew && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
              NEW
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {job.title}
        </h3>
        <div className="flex flex-col space-y-1 mb-4 text-sm text-gray-500">
          {job.lastDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last Date: <span className="font-medium text-red-600">{job.lastDate}</span></span>
            </div>
          )}
          <div className="flex items-center">
            <span className="text-xs">Source: {job.sourceWebsite}</span>
          </div>
        </div>
        <a 
          href={job.applyLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          {job.category === 'Result' ? 'Check Result' : job.category === 'Admit Card' ? 'Download Admit Card' : 'Apply Now'}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Find Your Dream <span className="text-blue-600">Government Job</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Latest updates on Sarkari Results, Admit Cards, and Job Notifications automatically fetched from trusted sources.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for jobs, results, admit cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map(renderJobCard)}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}
