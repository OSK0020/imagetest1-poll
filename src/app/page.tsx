'use client';

import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<{ url: string; prompt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('שגיאה: Please enter something first / הכנס משהו');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const seed = Math.floor(Math.random() * 99999);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=768&height=768&seed=${seed}&nologo=true`;

      // Wait for image to be ready
      await new Promise(res => setTimeout(res, 3500));

      setImages(prev => [{ url, prompt }, ...prev]);
    } catch {
      setError('Error / שגיאה: Something went wrong כנראה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', background: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>

      <div style={{ background: '#ddd', border: '1px solid #aaa', padding: '10px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', margin: 0 }}>
          🖼 Image Generator / מחולל תמונות — Flux Model
        </h1>
        <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0' }}>
          v0.1.2-beta | Build 2024 | Status: running / פועל
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '4px', width: '80px', fontSize: '12px', color: '#333' }}>
              Prompt / פרומפט:
            </td>
            <td style={{ padding: '4px' }}>
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. a cat / חתול..."
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '2px inset #ccc',
                  fontSize: '13px',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              />
            </td>
            <td style={{ padding: '4px', whiteSpace: 'nowrap' }}>
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: '6px 14px',
                  background: loading ? '#aaa' : '#6a3fcb',
                  color: 'white',
                  border: '2px outset #9966ff',
                  fontSize: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? '...מייצר / Generating...' : 'צור / Generate'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {error && (
        <div style={{ background: '#ffcccc', border: '1px solid red', padding: '6px 10px', fontSize: '12px', marginBottom: '10px', color: '#900' }}>
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div style={{ background: '#fffde0', border: '1px dashed #bbb', padding: '10px', fontSize: '12px', color: '#555', marginBottom: '10px', textAlign: 'center' }}>
          ⏳ אנא המתן... Please wait... Processing image request...
        </div>
      )}

      <hr style={{ borderTop: '2px solid #bbb', marginBottom: '12px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
        {images.map((img, i) => (
          <div key={i} style={{ border: '1px solid #bbb', background: 'white', padding: '4px' }}>
            <img
              src={img.url}
              alt={img.prompt}
              style={{ width: '100%', display: 'block', border: '1px inset #ddd' }}
              loading="lazy"
            />
            <p style={{ fontSize: '10px', color: '#555', margin: '4px 2px 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              #{images.length - i} | {img.prompt}
            </p>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '40px' }}>
          אין תמונות | No images yet
        </div>
      )}

      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '8px', fontSize: '10px', color: '#aaa' }}>
        Powered by Pollinations.ai | מופעל על ידי | flux | Model: default
      </div>
    </div>
  );
}
