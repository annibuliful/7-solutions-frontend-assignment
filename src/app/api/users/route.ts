import { groupDepartmentByUserData } from '@/utils/groupByUserData';

export async function GET() {
  const response = await fetch(
    process.env.USER_API_ENDPOINT as string
  );
  const data = await response.json();
  const summary = groupDepartmentByUserData(data.users);

  return new Response(JSON.stringify(summary), {
    status: 200,
  });
}
