import { useEffect, useState } from 'react';
import { supabase, Note } from '../lib/supabase';
import { BookOpen, Download, Filter, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Notes() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    subject: '',
  });

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'Algorithms', 'Database', 'Operating Systems', 'Networks', 'Other'];

  useEffect(() => {
    loadNotes();
    loadBookmarks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, notes]);

  const loadNotes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const loadBookmarks = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', profile.id)
      .eq('item_type', 'note');

    if (data) {
      setBookmarkedIds(new Set(data.map(b => b.item_id)));
    }
  };

  const applyFilters = () => {
    let filtered = notes;

    if (filters.branch) {
      filtered = filtered.filter(n => n.branch === filters.branch);
    }
    if (filters.semester) {
      filtered = filtered.filter(n => n.semester === parseInt(filters.semester));
    }
    if (filters.subject) {
      filtered = filtered.filter(n => n.subject === filters.subject);
    }

    setFilteredNotes(filtered);
  };

  const toggleBookmark = async (noteId: string) => {
    if (!profile) return;

    if (bookmarkedIds.has(noteId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('item_type', 'note')
        .eq('item_id', noteId);

      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: profile.id,
          item_type: 'note',
          item_id: noteId,
        });

      setBookmarkedIds(prev => new Set(prev).add(noteId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <BookOpen className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">Study Notes</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <button
                  onClick={() => toggleBookmark(note.id)}
                  className={`p-2 rounded-lg transition ${
                    bookmarkedIds.has(note.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                  }`}
                >
                  <Bookmark className="w-5 h-5" fill={bookmarkedIds.has(note.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{note.description || 'No description'}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {note.branch}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Sem {note.semester}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                  {note.subject}
                </span>
              </div>

              <a
                href={note.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
