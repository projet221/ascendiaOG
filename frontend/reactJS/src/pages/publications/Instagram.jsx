const InstagramPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://posts-ney0.onrender.com/api/instagram/posts') // ou via la gateway
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur de récupération des posts:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!posts.length) return <p>Aucune publication trouvée.</p>;

  return (
    <div className="posts" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {posts.map((post) => (
        <div key={post.id} className="post" style={{ maxWidth: '300px' }}>
          <a href={post.permalink} target="_blank" rel="noopener noreferrer">
            {post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM' ? (
              <img src={post.media_url} alt={post.caption || 'Instagram'} style={{ width: '100%' }} />
            ) : post.media_type === 'VIDEO' ? (
              <video controls style={{ width: '100%' }}>
                <source src={post.media_url} type="video/mp4" />
              </video>
            ) : null}
          </a>
          {post.caption && <p>{post.caption}</p>}
        </div>
      ))}
    </div>
  );
};

export default InstagramPosts;