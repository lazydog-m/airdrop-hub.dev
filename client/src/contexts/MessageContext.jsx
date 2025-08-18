import { Color } from '@/enums/enum';
import useMessage from '@/hooks/useMessage';
import { message } from 'antd';
import { CheckSquare, CircleCheck, CircleX } from 'lucide-react';
import PropTypes from 'prop-types';
import { createContext } from 'react';

const initialState = {
  onSuccess: () => { },
  onError: () => { },
}

const MessageContext = createContext(initialState);

MessageProvider.propTypes = {
  children: PropTypes.node,
}

function MessageProvider({ children }) {

  const [messageApi, contextHolder] = message.useMessage();

  const success = (message) => {
    messageApi.open({
      type: 'success',
      content: message,
      duration: 5,
      icon: <CircleCheck size={'16px'} className='me-5' />,
    });
  };

  const error = (message) => {
    messageApi.open({
      type: 'error',
      content: message,
      duration: 5,
      icon: <CircleX size={'16px'} className='me-5' />,
    });
  };

  // const info = (message) => {
  //   messageApi.open({
  //     type: 'info',
  //     content: message,
  //     duration: 5,
  //     icon: <CircleX size={'16px'} className='me-5' />,
  //   });
  // };
  // const warning = (message) => {
  //   messageApi.open({
  //     type: 'error',
  //     content: message,
  //     duration: 5,
  //     icon: <CircleX size={'16px'} className='me-5' />,
  //   });
  // };

  return (
    <MessageContext.Provider
      value={{
        onSuccess: success,
        onError: error,
      }}
    >
      {contextHolder}
      {children}
    </MessageContext.Provider>
  )
}

export { MessageProvider, MessageContext }
