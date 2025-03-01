import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, officersCollection } from '../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

function CaseAssignment() {
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounty, setSelectedCounty] = useState('');

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
    'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  useEffect(() => {
    fetchUnassignedCases();
    fetchOfficers();
  }, [selectedCounty]);

  const fetchUnassignedCases = async () => {
    try {
      const casesRef = collection(db, 'reports');
      let q = query(
        casesRef,
        where('status', '==', 'pending'),
        where('assigned', '==', false)
      );

      if (selectedCounty) {
        q = query(
          casesRef,
          where('status', '==', 'pending'),
          where('assigned', '==', false),
          where('county', '==', selectedCounty)
        );
      }

      const querySnapshot = await getDocs(q);
      const casesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCases(casesList);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    }
  };

  const fetchOfficers = async () => {
    try {
      let q = query(
        officersCollection,
        where('available', '==', true)
      );

      if (selectedCounty) {
        q = query(
          officersCollection,
          where('available', '==', true),
          where('county', '==', selectedCounty)
        );
      }

      const querySnapshot = await getDocs(q);
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

  const handleAssignCase = async (caseId, officerId) => {
    try {
      const caseRef = doc(db, 'reports', caseId);
      const officerRef = doc(db, 'officers', officerId);
      const officer = officers.find(o => o.id === officerId);
      const caseDetails = cases.find(c => c.id === caseId);

      await updateDoc(caseRef, {
        assigned: true,
        assignedTo: {
          id: officerId,
          name: officer.name,
          rank: officer.rank,
          station: officer.station
        },
        status: 'investigating',
        assignedAt: new Date()
      });

      await updateDoc(officerRef, {
        assignedCases: [...(officer.assignedCases || []), caseId]
      });

      try {
        await fetch('http://localhost:5000/api/email/officer-assignment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            caseDetails: {
              ...caseDetails,
              trackingId: caseId,
              priority: caseDetails.priority || 'Medium',
              location: `${caseDetails.location}, ${caseDetails.county}`,
              incidentType: caseDetails.title,
              description: caseDetails.description
            },
            officerEmail: officer.email,
            officerDetails: {
              name: officer.name,
              badgeNumber: officer.badgeNumber,
              rank: officer.rank,
              station: officer.station
            }
          })
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      toast.success('Case assigned successfully');
      fetchUnassignedCases();
      fetchOfficers();
    } catch (error) {
      console.error('Error assigning case:', error);
      toast.error('Failed to assign case');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Case Assignment</h2>

      {/* County Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by County
        </label>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          className="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        >
          <option value="">All Counties</option>
          {counties.map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
      </div>

      {/* Unassigned Cases */}
      <div className="grid grid-cols-1 gap-4">
        {cases.map(case_ => (
          <motion.div
            key={case_.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-4 shadow"
          >
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="font-semibold text-lg">{case_.title}</h3>
                <p className="text-sm text-gray-600">{case_.description}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Location: {case_.county}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm text-gray-600">
                    Reported: {new Date(case_.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Officer
                </label>
                <select
                  onChange={(e) => handleAssignCase(case_.id, e.target.value)}
                  className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  defaultValue=""
                >
                  <option value="" disabled>Select Officer</option>
                  {officers
                    .filter(officer => officer.county === case_.county)
                    .map(officer => (
                      <option key={officer.id} value={officer.id}>
                        {officer.rank} {officer.name} - {officer.station}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </motion.div>
        ))}

        {cases.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No unassigned cases found.
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseAssignment; 