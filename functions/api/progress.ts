export async function onRequestGet(): Promise<Response> {
  return new Response(
    JSON.stringify({
      completedLessons: [],
      lessonPositions: {},
      pregnancyProfile: null,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function onRequestPost(): Promise<Response> {
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
