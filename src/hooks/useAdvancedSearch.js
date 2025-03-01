import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  getDocs,
  Timestamp
} from 'firebase/firestore';

function useAdvancedSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const searchReports = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const reportsRef = collection(db, 'reports');
      let queryConstraints = [];

      // Add keyword search
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        queryConstraints.push(
          where('description', '>=', keyword),
          where('description', '<=', keyword + '\uf8ff')
        );
      }

      // Add date range filter
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        queryConstraints.push(
          where('timestamp', '>=', Timestamp.fromDate(startDate))
        );
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59);
        queryConstraints.push(
          where('timestamp', '<=', Timestamp.fromDate(endDate))
        );
      }

      // Add severity filter
      if (filters.severity) {
        queryConstraints.push(where('severity', '==', filters.severity));
      }

      // Add status filter
      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }

      // Add location filter
      if (filters.location) {
        const location = filters.location.toLowerCase();
        queryConstraints.push(
          where('location', '>=', location),
          where('location', '<=', location + '\uf8ff')
        );
      }

      // Add incident type filter
      if (filters.incidentType) {
        queryConstraints.push(where('incidentType', '==', filters.incidentType));
      }

      // Create compound query
      const q = query(
        reportsRef,
        ...queryConstraints,
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const searchResults = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setResults([]);
    setError(null);
  };

  return {
    loading,
    error,
    results,
    searchReports,
    resetSearch
  };
}

export default useAdvancedSearch; 