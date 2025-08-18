import { useContext } from 'react';
import { SpinnerContext } from '@/contexts/SpinnerContext';

const useSpinner = () => useContext(SpinnerContext);

export default useSpinner;
