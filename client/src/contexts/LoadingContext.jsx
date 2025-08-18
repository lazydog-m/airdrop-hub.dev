import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';

const initialState = {
  onOpenLoading: () => { },
  onCloseLoading: () => { },
}

const LoadingContext = createContext(initialState);

LoadingProvider.propTypes = {
  children: PropTypes.node,
}

const rootStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 9999,
}

function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenLoading = () => {
    setIsLoading(true);
  }

  const handleCloseLoading = () => {
    setIsLoading(false);
  }

  return (
    <LoadingContext.Provider
      value={{
        onOpenLoading: handleOpenLoading,
        onCloseLoading: handleCloseLoading,
      }}
    >
      {isLoading &&
        <LoadingScreen />
      }
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, LoadingContext }
