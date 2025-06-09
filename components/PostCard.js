import Link from 'next/link';

export default function PostCard({ post, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          #{post.id}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.body}
      </p>
      
      <div className="flex justify-between items-center">
        <Link 
          href={`/posts/${post.id}`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </Link>
        
        {onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="inline-flex items-center px-3 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
