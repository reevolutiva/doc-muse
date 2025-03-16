import { fetchData } from '../lib/supabase';
import { toast } from 'react-toastify';

const SomeComponent = () => {
  const loadData = async () => {
    try {
      const data = await fetchData();
      // ...existing code to handle data...
    } catch (error) {
      toast.error('Failed to load data. Please try again later.');
      console.error('Error loading data:', error);
    }
  };

  // ...existing code...
  return (
    <div>
      {/* ...existing JSX... */}
    </div>
  );
};

export default SomeComponent;