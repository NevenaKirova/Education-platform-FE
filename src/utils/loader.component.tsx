import React from 'react';
import { Spinner } from '@chakra-ui/react';
export const PageLoader = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading ? (
    <div className="page-loader">
      <div className="content">
        <span className="logo" />
        <Spinner className="spinner" />
      </div>
    </div>
  ) : null;
};

export default PageLoader;
