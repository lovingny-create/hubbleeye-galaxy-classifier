export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process image",
      },
      { status: 500 }
    );
  }
}
