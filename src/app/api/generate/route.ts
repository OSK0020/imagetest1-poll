import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, model, seed, width, height, userKey } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const appKey = process.env.POLLINATIONS_APP_KEY;
    const generationSecret = process.env.APP_GENERATION_SECRET;

    // PROTECTION: This API only works if the secret is correctly set in the environment.
    // GitHub downloads won't have this, effectively disabling the generation for outsiders.
    if (!generationSecret) {
      return NextResponse.json({ 
        error: 'Unauthorized: Missing App Secret. This code is protected by OSK0020.' 
      }, { status: 401 });
    }

    // Use the official Pollinations endpoint for generating images
    // Note: BYOP usually requires specific headers and potentially a POST request
    const baseUrl = 'https://pollinations.ai/p/';
    const pollUrl = `${baseUrl}${encodeURIComponent(prompt)}?width=${width || 1024}&height=${height || 1024}&seed=${seed || 42}&model=${model || 'flux'}&nologo=true`;

    const headers: Record<string, string> = {};
    if (userKey) {
      // User's secret key Sk_... used for their own pollen
      headers['Authorization'] = `Bearer ${userKey}`;
    }
    
    // Add the App Key (pk_...) to signify this request is coming from our registered app
    if (appKey) {
      headers['x-pollinations-app-key'] = appKey;
    }

    const response = await fetch(pollUrl, {
      method: 'GET', // Pollinations image endpoint is GET
      headers,
    });

    if (!response.ok) {
        throw new Error(`Pollinations error: ${response.status} ${response.statusText}`);
    }

    // Return the image data as a blob
    const blob = await response.blob();
    return new Response(blob, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    console.error('API Generate Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
