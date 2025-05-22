import { groupDepartmentByUserData } from '@/utils/groupByUserData';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const response = await fetch('https://dummyjson.com/users');
  const data = await response.json();
  const summary = groupDepartmentByUserData(data.users);

  return new Response(JSON.stringify(summary), {
    status: 200,
  });
}
