import { useState } from "react";

const useCopy = () => {

  const [copied, setCopied] = useState({
    id: null, type: null,
  });

  const handleCopy = (id, type) => {
    setCopied({
      id, type,
    });
  }

  return { copied, handleCopy };
}
export default useCopy;
