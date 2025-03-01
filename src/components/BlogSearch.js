import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, startAt, endAt, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CalendarIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function BlogSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch unique categories
    const fetchCategories = async () => {
      const postsRef = collection(db, 'blogPosts');
      const querySnapshot = await getDocs(postsRef);
      const uniqueCategories = new Set();
      querySnapshot.docs.forEach(doc => {
        const postCategories = doc.data().categories || [];
        postCategories.forEach(category => uniqueCategories.add(category));
      });
      setCategories(Array.from(uniqueCategories));
    };
    fetchCategories();
  }, []);

  const searchPosts = async () => {
    setLoading(true);
    try {
      const postsRef = collection(db, 'blogPosts');
      let q = query(postsRef, where('status', '==', 'published'));

      if (searchTerm) {
        q = query(
          postsRef,
          where('status', '==', 'published'),
          orderBy('title'),
          startAt(searchTerm),
          endAt(searchTerm + '\uf8ff')
        );
      }

      if (selectedCategory) {
        q = query(
          postsRef,
          where('status', '==', 'published'),
          where('categories', 'array-contains', selectedCategory)
        );
      }

      if (dateFilter) {
        const date = new Date(dateFilter);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        q = query(
          postsRef,
          where('status', '==', 'published'),
          where('publishedAt', '>=', date),
          where('publishedAt', '<', nextDay)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm || selectedCategory || dateFilter) {
      searchPosts();
    }
  }, [searchTerm, selectedCategory, dateFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
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
      )}
    </div>
  );
}

export default BlogSearch; 