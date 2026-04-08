import { useEffect, useState } from 'react';
import { supabase, Bookmark as BookmarkType } from '../lib/supabase';
import { Bookmark, BookOpen, Code, Trophy, Newspaper, Briefcase, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type BookmarkWithDetails = BookmarkType & {
  details?: any;
};

export function Bookmarks() {
  const { profile } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');

  const types = [
    { value: 'note', label: 'Notes', icon: BookOpen, color: 'blue' },
    { value: 'practice', label: 'Practice', icon: Code, color: 'green' },
    { value: 'test', label: 'Tests', icon: Trophy, color: 'orange' },
    { value: 'news', label: 'News', icon: Newspaper, color: 'red' },
    { value: 'opportunity', label: 'Opportunities', icon: Briefcase, color: 'purple' },
  ];

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    if (!profile) return;
    setLoading(true);

    const { data: bookmarkData } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (bookmarkData) {
      const bookmarksWithDetails = await Promise.all(
        bookmarkData.map(async (bookmark) => {
          const tableName =
            bookmark.item_type === 'note' ? 'notes' :
            bookmark.item_type === 'practice' ? 'practice_questions' :
            bookmark.item_type === 'test' ? 'mock_tests' :
            bookmark.item_type === 'news' ? 'tech_news' :
            'opportunities';

          const { data } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', bookmark.item_id)
            .maybeSingle();

          return { ...bookmark, details: data };
        })
      );

      setBookmarks(bookmarksWithDetails.filter(b => b.details !== null));
    }
    setLoading(false);
  };

  const removeBookmark = async (bookmarkId: string) => {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);

    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
  };

  const filteredBookmarks = selectedType
    ? bookmarks.filter(b => b.item_type === selectedType)
    : bookmarks;

  const getTypeInfo = (type: string) => {
    return types.find(t => t.value === type) || types[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading bookmarks...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Bookmark className="w-10 h-10 text-yellow-600" />
        <h1 className="text-4xl font-bold text-gray-900">My Bookmarks</h1>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedType('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === ''
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({bookmarks.length})
          </button>
          {types.map(type => {
            const count = bookmarks.filter(b => b.item_type === type.value).length;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedType === type.value
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600">Start bookmarking content to access it quickly later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => {
            const typeInfo = getTypeInfo(bookmark.item_type);
            const Icon = typeInfo.icon;
            return (
              <div key={bookmark.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-${typeInfo.color}-100 p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${typeInfo.color}-600`} />
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <span className={`inline-block px-3 py-1 bg-${typeInfo.color}-100 text-${typeInfo.color}-700 text-sm font-medium rounded-full mb-3`}>
                  {typeInfo.label}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {bookmark.details?.title || 'Untitled'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Saved on {new Date(bookmark.created_at).toLocaleDateString()}
                </p>

                {bookmark.item_type === 'note' && bookmark.details?.subject && (
                  <p className="text-sm text-gray-600">
                    Subject: {bookmark.details.subject}
                  </p>
                )}
                {bookmark.item_type === 'practice' && bookmark.details?.topic && (
                  <p className="text-sm text-gray-600">
                    Topic: {bookmark.details.topic}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
