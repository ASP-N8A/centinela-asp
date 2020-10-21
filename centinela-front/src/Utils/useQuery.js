import { useLocation } from 'react-router-dom';

const useURLQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default useURLQuery;
