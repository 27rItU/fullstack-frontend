'use client';

import { useState, useEffect } from 'react';
import { postsApi } from '../lib/api';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import CreatePostModal from '../components/CreatePostModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page) => {
    try {
      setLoading(true);
      const response = await postsApi.getPosts(page, postsPerPage);
      setPosts(response.data);
      setTotalPosts(response.total);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      // Optimistic update
      const tempPost = {
        ...postData,
        id: Date.now(), // Temporary ID
      };
      setPosts(prev => [tempPost, ...prev.slice(0, -1)]);

      // API call
      const newPost = await postsApi.createPost(postData);
      
      // Update with real data
      setPosts(prev => prev.map(post => 
        post.id === tempPost.id ? newPost : post
      ));
      setTotalPosts(prev => prev + 1);
    } catch (error) {
      // Revert optimistic update on error
      await loadPosts(currentPage);
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      // Optimistic update
      const originalPosts = posts;
      setPosts(prev => prev.filter(post => post.id !== postId));
      setTotalPosts(prev => prev - 1);

      // API call
      await postsApi.deletePost(postId);
    } catch (error) {
      // Revert on error
      setPosts(originalPosts);
      setTotalPosts(prev => prev + 1);
      console.error('Error deleting post:', error);
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Posts Dashboard</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500 mb-4">Create your first post to get started.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Create Post
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}