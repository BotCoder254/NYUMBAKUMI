import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  CalendarIcon, 
  TagIcon, 
  UserIcon,
  ShareIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import RelatedPosts from './RelatedPosts';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'blogPosts', id));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
          // Increment view count
          await updateDoc(doc(db, 'blogPosts', id), {
            views: increment(1)
          });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!liked) {
      try {
        await updateDoc(doc(db, 'blogPosts', id), {
          likes: increment(1)
        });
        setLiked(true);
        setPost(prev => ({
          ...prev,
          likes: (prev.likes || 0) + 1
        }));
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post.title;
    let shareUrl;

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-6"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-600 hover:text-red-600 flex items-center transition duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Blog
        </motion.button>

        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {post.title}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(post.publishedAt?.seconds * 1000).toLocaleDateString()}
            </div>
            {post.author && (
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {post.author.name}
              </div>
            )}
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {post.views || 0} views
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center ${liked ? 'text-red-600' : 'hover:text-red-600'}`}
            >
              <HeartIcon className="h-4 w-4 mr-1" />
              {post.likes || 0} likes
            </button>
          </div>
          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.images?.[0] && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-[500px] object-cover rounded-lg shadow-md"
            />
          </motion.div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="h-5 w-5 text-gray-500" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShareIcon className="h-5 w-5 mr-2" />
              Share this post
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleShare('twitter')}
                className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-[#4267B2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="bg-[#0077B5] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                WhatsApp
              </button>
            </div>
          </motion.div>
        </div>

        {/* Media Gallery */}
        {(post.images?.length > 1 || post.videos?.length > 0) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-8 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.images?.slice(1).map((image, index) => (
                <img
                  key={`image-${index}`}
                  src={image}
                  alt={`${post.title} - Image ${index + 2}`}
                  className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
                  onClick={() => window.open(image, '_blank')}
                />
              ))}
              {post.videos?.map((video, index) => (
                <div key={`video-${index}`} className="relative">
                  <video
                    src={video}
                    controls
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Posts */}
        <RelatedPosts
          currentPostId={post.id}
          tags={post.tags}
          categories={post.categories}
        />
      </motion.article>
    </div>
  );
}

export default BlogPost; 