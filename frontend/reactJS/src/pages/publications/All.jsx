import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import BarreHaut from "../../components/BarreHaut.jsx";
import SidebarPublication from "../../components/SideBarPublication.jsx";

function All() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' ou 'twitter'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = activeTab === 'twitter' 
          ? '/posts/twitter' 
          : '/posts';
        
        const response = await axios.get(endpoint);
        setPosts(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des publications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  const handleDelete = async (postId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette publication?")) {
      try {
        await axios.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setError("Échec de la suppression");
      }
    }
  };

  return (
    <div>
      <BarreHaut/>
      <SidebarPublication/>
      <div className="ml-64 mt-16 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes Publications</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-[#FF0035] text-white' : 'bg-gray-200'}`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveTab('twitter')}
              className={`px-4 py-2 rounded-md ${activeTab === 'twitter' ? 'bg-[#FF0035] text-white' : 'bg-gray-200'}`}
            >
              Twitter
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center">Chargement des publications...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center">Aucune publication trouvée</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow">
                {post.platform === 'twitter' && (
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="text-sm text-gray-500">Twitter</span>
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-3">{post.content}</p>
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(post._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default All;