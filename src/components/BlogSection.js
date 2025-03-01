import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CalendarIcon, UserIcon, EyeIcon } from '@heroicons/react/24/outline';

function BlogSection() {
  const [posts, setPosts] = useState({ featured: [], recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, 'blogPosts');
    const q = query(
      postsRef,
      where('status', '==', 'published')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const allPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          views: doc.data().views || 0,
          shares: doc.data().shares || 0,
          likes: doc.data().likes || 0,
          publishedAt: doc.data().publishedAt || doc.data().createdAt
        }));

        // Sort by publishedAt date
        allPosts.sort((a, b) => {
          const dateA = a.publishedAt?.toDate?.() || new Date(a.publishedAt);
          const dateB = b.publishedAt?.toDate?.() || new Date(b.publishedAt);
          return dateB - dateA;
        });

        // Split into featured and recent posts
        const featured = allPosts.filter(post => post.featured).slice(0, 2);
        const recent = allPosts.filter(post => !post.featured).slice(0, 4);

        setPosts({ featured, recent });
        setLoading(false);
      } catch (error) {
        console.error('Error processing posts:', error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    const strippedText = text.replace(/<[^>]*>/g, '');
    return strippedText.length > maxLength
      ? strippedText.substring(0, maxLength) + '...'
      : strippedText;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate?.() || new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Updates & Safety Tips</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest safety tips, community updates, and important announcements.
            </p>
          </motion.div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Updates & Safety Tips</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest safety tips, community updates, and important announcements.
          </p>
        </motion.div>

        {/* Featured Posts */}
        {posts.featured?.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {posts.featured.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-red-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              >
                {post.images?.[0] && (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                      Featured
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {post.views} views
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {truncateText(post.content)}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                      {post.author?.name && (
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {post.author.name}
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Posts */}
        {posts.recent?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.recent.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              >
                {post.images?.[0] && (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {truncateText(post.content, 100)}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3 text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available.</p>
          </div>
        )}

        {/* View All Posts Link */}
        <div className="text-center mt-12">
          <Link
            to="/blog/search"
            className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-300"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogSection; 