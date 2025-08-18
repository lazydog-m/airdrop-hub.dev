import { useEffect } from 'react';
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// ----------------------------------------------------------------------

export default function LoadingScreen({ }) {
  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    NProgress.start();

    return () => {
      NProgress.done();
    };
  });
  return (
    <>
    </>
  );
}
