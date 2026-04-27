import { useEffect, useState } from 'react';
import { supabase, TechNews as TechNewsType } from '../lib/supabase';
import { Newspaper, ExternalLink, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function TechNews() {
  const { profile } = useAuth();
  const [news, setNews] = useState<TechNewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = ['AI', 'Tech Trends', 'Industry', 'Startups', 'Development'];

  useEffect(() => {
    loadNews();
    loadBookmarks();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tech_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setNews(data);
    }
    setLoading(false);
  };

  const loadBookmarks = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', profile.id)
      .eq('item_type', 'news');

    if (data) {
      setBookmarkedIds(new Set(data.map(b => b.item_id)));
    }
  };

  const toggleBookmark = async (newsId: string) => {
    if (!profile) return;

    if (bookmarkedIds.has(newsId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('item_type', 'news')
        .eq('item_id', newsId);

      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(newsId);
        return next;
      });
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: profile.id,
          item_type: 'news',
          item_id: newsId,
        });

      setBookmarkedIds(prev => new Set(prev).add(newsId));
    }
  };

  const filteredNews = selectedCategory
    ? news.filter(n => n.category === selectedCategory)
    : news;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Newspaper className="w-10 h-10 text-red-600" />
        <h1 className="text-4xl font-bold text-white-900">Tech News</h1>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === ''
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No news available</h3>
          <p className="text-gray-600">Check back later for the latest tech updates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    {item.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 rounded-lg transition ${
                      bookmarkedIds.has(item.id)
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                    }`}
                  >
                    <Bookmark className="w-5 h-5" fill={bookmarkedIds.has(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <span>Read More</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
