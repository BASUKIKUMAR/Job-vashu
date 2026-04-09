import { NextResponse } from 'next/server';
import { getAdminJobs, updateJobStatus, deleteJob } from '@/lib/db';

export async function GET() {
  try {
    const jobs = getAdminJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin jobs' }, { status: 500 });
  }
}
