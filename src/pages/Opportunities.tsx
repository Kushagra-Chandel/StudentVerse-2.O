import { useEffect, useState } from 'react';
import { supabase, Opportunity } from '../lib/supabase';
import { Briefcase, ExternalLink, Calendar, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Opportunities() {
  const { profile } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedType, setSelectedType] = useState<string>('');

  const types = ['hackathon', 'internship', 'drive', 'course'];

  useEffect(() => {
    loadOpportunities();
    loadBookmarks();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setOpportunities(data);
    }
    setLoading(false);
  };

  const loadBookmarks = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', profile.id)
      .eq('item_type', 'opportunity');

    if (data) {
      setBookmarkedIds(new Set(data.map(b => b.item_id)));
    }
  };

  const toggleBookmark = async (oppId: string) => {
    if (!profile) return;

    if (bookmarkedIds.has(oppId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('item_type', 'opportunity')
        .eq('item_id', oppId);

      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(oppId);
        return next;
      });
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: profile.id,
          item_type: 'opportunity',
          item_id: oppId,
        });

      setBookmarkedIds(prev => new Set(prev).add(oppId));
    }
  };

  const filteredOpportunities = selectedType
    ? opportunities.filter(o => o.type === selectedType)
    : opportunities;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hackathon': return 'bg-purple-100 text-purple-700';
      case 'internship': return 'bg-blue-100 text-blue-700';
      case 'drive': return 'bg-green-100 text-green-700';
      case 'course': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Briefcase className="w-10 h-10 text-purple-600" />
        <h1 className="text-4xl font-bold text-gray-900">Opportunities</h1>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedType('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === ''
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                selectedType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No opportunities available</h3>
          <p className="text-gray-600">Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => (
            <div key={opp.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(opp.type)}`}>
                    {opp.type}
                  </span>
                  {opp.company && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {opp.company}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleBookmark(opp.id)}
                  className={`p-2 rounded-lg transition ${
                    bookmarkedIds.has(opp.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                  }`}
                >
                  <Bookmark className="w-5 h-5" fill={bookmarkedIds.has(opp.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{opp.title}</h3>
              <p className="text-gray-600 mb-4">{opp.description}</p>

              <div className="flex items-center justify-between">
                {opp.deadline && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {opp.apply_url && (
                  <a
                    href={opp.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
