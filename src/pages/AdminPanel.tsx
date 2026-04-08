import { useState } from 'react';
import { Shield, BookOpen, Code, Trophy, Newspaper, Briefcase } from 'lucide-react';
import { AddNoteForm } from '../components/Admin/AddNoteForm';
import { AddPracticeForm } from '../components/Admin/AddPracticeForm';
import { AddTestForm } from '../components/Admin/AddTestForm';
import { AddNewsForm } from '../components/Admin/AddNewsForm';
import { AddOpportunityForm } from '../components/Admin/AddOpportunityForm';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'notes' | 'practice' | 'tests' | 'news' | 'opportunities'>('notes');

  const tabs = [
    { id: 'notes' as const, label: 'Add Notes', icon: BookOpen, color: 'blue' },
    { id: 'practice' as const, label: 'Add Practice', icon: Code, color: 'green' },
    { id: 'tests' as const, label: 'Create Tests', icon: Trophy, color: 'orange' },
    { id: 'news' as const, label: 'Post News', icon: Newspaper, color: 'red' },
    { id: 'opportunities' as const, label: 'Add Opportunities', icon: Briefcase, color: 'purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-green-100 p-3 rounded-lg">
          <Shield className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage platform content</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-2 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-100 text-${tab.color}-700`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'notes' && <AddNoteForm />}
          {activeTab === 'practice' && <AddPracticeForm />}
          {activeTab === 'tests' && <AddTestForm />}
          {activeTab === 'news' && <AddNewsForm />}
          {activeTab === 'opportunities' && <AddOpportunityForm />}
        </div>
      </div>
    </div>
  );
}
