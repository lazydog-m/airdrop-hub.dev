import { Color } from '@/enums/enum';
import { message, notification } from 'antd';
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

  // const [messageApi, contextHolder] = message.useMessage();
  const [messageApi, contextHolder] = notification.useNotification();

  const success = (message = '', desc = null) => {
    messageApi.open({
      type: 'success',
      message,
      description: desc,
      showProgress: true,
      pauseOnHover: false,
      style: {
        height: !desc ? '65px' : '',
        zIndex: 10000,
      },
    });
  };

  // const success = (message) => {
  //   messageApi.open({
  //     type: 'success',
  //     content: message,
  //     duration: 5,
  //     icon: <CircleCheck size={'16px'} className='me-5' />,
  //     style: {
  //       zIndex: 10000,
  //     }
  //   });
  // };

  // const error = (message) => {
  //   messageApi.open({
  //     type: 'error',
  //     content: message,
  //     duration: 5,
  //     icon: <CircleX size={'16px'} className='me-5' />,
  //     style: {
  //       zIndex: 10000,
  //     }
  //   });
  // };

  const error = (message = '', desc = null) => {
    messageApi.open({
      type: 'error',
      message,
      description: desc,
      showProgress: true,
      pauseOnHover: false,
      style: {
        height: !desc ? '65px' : '',
        zIndex: 10000,
      },
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
