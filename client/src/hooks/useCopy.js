import { useState } from "react";

const useCopy = () => {

  const [copied, setCopied] = useState({
    id: null, type: null,
  });

  const handleCopy = (id, text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({
        id, type,
      });
    });
  }

  return { copied, handleCopy };
}
export default useCopy;
