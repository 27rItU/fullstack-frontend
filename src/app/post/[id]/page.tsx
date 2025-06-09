
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setPost(data);
    }
    fetchPost();
  }, [id]);

  async function runAnalysis() {
    setLoading(true);
    const res = await fetch(`/api/posts/${id}/analysis`);
    const data = await res.json();
    setAnalysis(data.analysis);
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Post #{id}</h1>
      {post ? (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2">{post.body}</p>
        </div>
      ) : (
        <p>Loading post...</p>
      )}

      <button
        onClick={runAnalysis}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Analyzing...' : 'Run Analysis'}
      </button>

      {analysis && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Analysis Result:</h3>
          <p className="mt-2">Word Count: {analysis.word_count}</p>
          <h4 className="mt-2 font-medium">Top Keywords:</h4>
          <ul className="list-disc ml-6">
            {Object.entries(analysis.keywords).map(([word, count]) => (
              <li key={word}>{word}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
