import { motion } from 'framer-motion';
import AdvancedSearch from '../components/AdvancedSearch';
import SearchResults from '../components/SearchResults';
import useAdvancedSearch from '../hooks/useAdvancedSearch';

function SearchPage() {
  const { loading, error, results, searchReports, resetSearch } = useAdvancedSearch();

  const handleSearch = (filters) => {
    searchReports(filters);
  };

  const handleReset = () => {
    resetSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Reports
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Use the filters below to search through reports and find specific incidents.
          </p>
        </div>

        <AdvancedSearch onSearch={handleSearch} onReset={handleReset} />
        
        <SearchResults
          results={results}
          loading={loading}
          error={error}
        />
      </motion.div>
    </div>
  );
}

export default SearchPage; 