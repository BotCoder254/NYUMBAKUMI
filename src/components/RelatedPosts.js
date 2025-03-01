import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

function RelatedPosts({ currentPostId, tags = [], categories = [] }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        if (!tags.length && !categories.length) {
          setRelatedPosts([]);
          setLoading(false);
          return;
        }

        // Query posts that share tags or categories
        const postsRef = collection(db, 'blogPosts');
        const q = query(
          postsRef,
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(post => 
            post.id !== currentPostId && // Exclude current post
            (
              post.tags?.some(tag => tags.includes(tag)) ||
              post.categories?.some(category => categories.includes(category))
            )
          )
          .slice(0, 3); // Get only 3 related posts

        setRelatedPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, tags, categories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!relatedPosts.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 pt-8 border-t border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
          >
            {post.images?.[0] && (
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link
                  to={`/blog/${post.id}`}
                  className="hover:text-red-600 transition duration-300"
                >
                  {post.title}
                </Link>
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(post.publishedAt?.seconds * 1000).toLocaleDateString()}
                </div>
                {post.categories?.[0] && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                    {post.categories[0]}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default RelatedPosts; 