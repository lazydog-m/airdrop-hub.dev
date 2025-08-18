import { useContext } from 'react';
import { MessageContext } from '../contexts/MessageContext';

const useMessage = () => useContext(MessageContext);

export default useMessage;
