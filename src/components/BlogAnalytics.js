import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  ChartBarIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

function BlogAnalytics() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalShares: 0,
    totalLikes: 0,
    topPosts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, 'blogPosts');
    const q = query(
      postsRef,
      where('status', '==', 'published')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        let totalViews = 0;
        let totalShares = 0;
        let totalLikes = 0;
        let posts = [];

        querySnapshot.docs.forEach(doc => {
          const post = doc.data();
          totalViews += post.views || 0;
          totalShares += post.shares || 0;
          totalLikes += post.likes || 0;
          posts.push({ 
            id: doc.id, 
            ...post,
            views: post.views || 0,
            shares: post.shares || 0,
            likes: post.likes || 0
          });
        });

        // Sort posts by views and get top 5
        posts.sort((a, b) => b.views - a.views);
        const topPosts = posts.slice(0, 5);

        setStats({
          totalPosts: querySnapshot.size,
          totalViews,
          totalShares,
          totalLikes,
          topPosts
        });
        setLoading(false);
      } catch (error) {
        console.error('Error processing blog stats:', error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Posts</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPosts}</h3>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalViews}</h3>
            </div>
            <EyeIcon className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Shares</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalShares}</h3>
            </div>
            <ShareIcon className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Likes</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalLikes}</h3>
            </div>
            <HeartIcon className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center mb-4">
          <ArrowTrendingUpIcon className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Posts</h2>
        </div>
        <div className="space-y-4">
          {stats.topPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {post.views} views
                  </span>
                  <span className="flex items-center">
                    <ShareIcon className="h-4 w-4 mr-1" />
                    {post.shares} shares
                  </span>
                  <span className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {post.likes} likes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default BlogAnalytics; 