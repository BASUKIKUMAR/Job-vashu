'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trash2, ExternalLink } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  category: string;
  postDate: string;
  lastDate: string;
  applyLink: string;
  sourceWebsite: string;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const fetchAdminJobs = async () => {
    try {
      const res = await fetch('/api/admin/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch admin jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAdminJobs();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      fetchAdminJobs();
    } catch (error) {
      console.error('Failed to delete job', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
          Total Items: {jobs.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No items found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2" title={job.title}>
                        {job.title}
                      </div>
                      <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center mt-1">
                        View Link <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${job.category === 'Job' ? 'bg-blue-100 text-blue-800' : 
                          job.category === 'Result' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.sourceWebsite}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${job.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          job.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {job.status !== 'approved' && (
                          <button 
                            onClick={() => updateStatus(job.id, 'approved')}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {job.status !== 'rejected' && (
                          <button 
                            onClick={() => updateStatus(job.id, 'rejected')}
                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 p-1.5 rounded"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteJob(job.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
