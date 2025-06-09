'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiClient, Post, Analysis } from '@/lib/api'

export default function PostDetailsPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const fetchedPost = await apiClient.getPost(postId)
      setPost(fetchedPost)
      setEditedTitle(fetchedPost.title)
      
      // Automatically analyze the post
      analyzePost(fetchedPost.body)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const analyzePost = async (text: string) => {
    try {
      setAnalyzing(true)
      const analysisResult = await apiClient.analyzeText(text, parseInt(postId))
      setAnalysis(analysisResult)
    } catch (err) {
      console.error('Error analyzing post:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSaveTitle = async () => {
    if (!post) return

    try {
      const updatedPost = await apiClient.updatePost(post.id, editedTitle)
      setPost(updatedPost)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating post:', err)
      alert('Failed to update post title')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading post...
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error || 'Post not found'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Posts
      </Link>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Title Section */}
        <div className="mb-6">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 text-2xl font-bold border-2 border-blue-300 rounded px-3 py-2"
              />
              <button
                onClick={handleSaveTitle}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedTitle(post.title)
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Title
              </button>
            </div>
          )}
        </div>

        {/* Post Metadata */}
        <div className="mb-6 text-sm text-gray-500">
          <p>Post ID: {post.id}</p>
          {post.created_at && (
            <p>Created: {new Date(post.created_at).toLocaleString()}</p>
          )}
          {post.updated_at && post.updated_at !== post.created_at && (
            <p>Updated: {new Date(post.updated_at).toLocaleString()}</p>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Content</h2>
          <p className="text-gray-700 leading-relaxed">{post.body}</p>
        </div>

        {/* Analysis Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Smart Analysis (Powered by Your Backend) 
            {analyzing && <span className="text-blue-500 ml-2">⚡ Analyzing...</span>}
          </h2>
          
          {analysis ? (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-600 mb-2">Word Count</h3>
                <p className="text-3xl font-bold text-blue-600">{analysis.wordCount}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-600 mb-2">Top Keywords</h3>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-600 mb-2">Sentiment</h3>
                <p className={`text-lg font-semibold capitalize ${
                  analysis.sentiment === 'positive' ? 'text-green-600' : 
                  analysis.sentiment === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {analysis.sentiment} 
                  {analysis.sentiment === 'positive' && ' 😊'}
                  {analysis.sentiment === 'negative' && ' 😞'}
                  {analysis.sentiment === 'neutral' && ' 😐'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => analyzePost(post.body)}
            disabled={analyzing}
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : 'Re-analyze'}
          </button>
        </div>
      </div>
    </div>
  )
}