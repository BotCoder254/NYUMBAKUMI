import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { officersCollection } from '../config/firebase';
import { addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import '../styles/responsive.css';

const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const ranks = [
  'Chief Inspector',
  'Inspector',
  'Senior Superintendent',
  'Superintendent',
  'Assistant Superintendent',
];

function OfficerManagement() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    rank: '',
    county: '',
    station: '',
    badgeNumber: '',
    available: true,
    assignedCases: []
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const querySnapshot = await getDocs(officersCollection);
      const officersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOfficers(officersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching officers:', error);
      toast.error('Failed to load officers');
      setLoading(false);
    }
  };

  const handleEdit = (officer) => {
    setEditingOfficer(officer.id);
    setEditForm({
      name: officer.name,
      email: officer.email,
      phone: officer.phone || '',
      rank: officer.rank || '',
      county: officer.county || '',
      station: officer.station || '',
      badgeNumber: officer.badgeNumber || '',
      available: officer.available !== false,
      assignedCases: officer.assignedCases || []
    });
  };

  const handleCancelEdit = () => {
    setEditingOfficer(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
      rank: '',
      county: '',
      station: '',
      badgeNumber: '',
      available: true,
      assignedCases: []
    });
  };

  const handleSaveEdit = async (officerId) => {
    try {
      const officerRef = doc(db, 'officers', officerId);
      await updateDoc(officerRef, editForm);
      toast.success('Officer updated successfully');
      setEditingOfficer(null);
      fetchOfficers();
    } catch (error) {
      console.error('Error updating officer:', error);
      toast.error('Failed to update officer');
    }
  };

  const handleDelete = async (officerId) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;

    try {
      await deleteDoc(doc(db, 'officers', officerId));
      toast.success('Officer deleted successfully');
      fetchOfficers();
    } catch (error) {
      console.error('Error deleting officer:', error);
      toast.error('Failed to delete officer');
    }
  };

  const handleAddOfficer = async () => {
    try {
      if (!editForm.name || !editForm.email || !editForm.rank || !editForm.county || !editForm.station || !editForm.badgeNumber) {
        toast.error('Please fill in all required fields');
        return;
      }

      await addDoc(officersCollection, {
        ...editForm,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success('Officer added successfully');
      setShowAddForm(false);
      setEditForm({
        name: '',
        email: '',
        phone: '',
        rank: '',
        county: '',
        station: '',
        badgeNumber: '',
        available: true,
        assignedCases: []
      });
      fetchOfficers();
    } catch (error) {
      console.error('Error adding officer:', error);
      toast.error('Failed to add officer');
    }
  };

  const renderOfficerForm = (isEditing = false, officerId = null) => (
    <div className="space-y-3">
      <input
        type="text"
        value={editForm.name}
        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="Officer Name *"
      />
      <input
        type="email"
        value={editForm.email}
        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="Email *"
      />
      <input
        type="tel"
        value={editForm.phone}
        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="Phone"
      />
      <select
        value={editForm.rank}
        onChange={(e) => setEditForm(prev => ({ ...prev, rank: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
      >
        <option value="">Select Rank *</option>
        {ranks.map(rank => (
          <option key={rank} value={rank}>{rank}</option>
        ))}
      </select>
      <select
        value={editForm.county}
        onChange={(e) => setEditForm(prev => ({ ...prev, county: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
      >
        <option value="">Select County *</option>
        {counties.map(county => (
          <option key={county} value={county}>{county}</option>
        ))}
      </select>
      <input
        type="text"
        value={editForm.station}
        onChange={(e) => setEditForm(prev => ({ ...prev, station: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="Police Station *"
      />
      <input
        type="text"
        value={editForm.badgeNumber}
        onChange={(e) => setEditForm(prev => ({ ...prev, badgeNumber: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="Badge Number *"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={editForm.available}
          onChange={(e) => setEditForm(prev => ({ ...prev, available: e.target.checked }))}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">Available for new cases</label>
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        {isEditing ? (
          <>
            <button
              onClick={() => handleSaveEdit(officerId)}
              className="p-1 text-green-600 hover:text-green-700"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-gray-600 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAddOfficer}
              className="p-1 text-green-600 hover:text-green-700"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 text-gray-600 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Officer Management</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Officer
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Officer</h3>
          {renderOfficerForm()}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {officers.map(officer => (
          <div key={officer.id} className="bg-white rounded-lg shadow-sm p-4 relative">
            {editingOfficer === officer.id ? (
              renderOfficerForm(true, officer.id)
            ) : (
              <>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(officer)}
                    className="p-1 text-blue-600 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(officer.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="pt-6">
                  <h3 className="text-lg font-medium text-gray-900">{officer.name}</h3>
                  <p className="text-sm text-gray-500">{officer.email}</p>
                  {officer.phone && (
                    <p className="text-sm text-gray-500">{officer.phone}</p>
                  )}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-700">{officer.rank}</p>
                    <p className="text-sm text-gray-600">{officer.station}, {officer.county}</p>
                    <p className="text-sm text-gray-600">Badge: {officer.badgeNumber}</p>
                    <p className="text-sm text-gray-600">
                      Status: {officer.available ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-red-600">Unavailable</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      Assigned Cases: {officer.assignedCases?.length || 0}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficerManagement; 