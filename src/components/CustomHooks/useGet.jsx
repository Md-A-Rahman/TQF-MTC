import { useState, useEffect } from "react";
import axios from "axios";
import { notifyError } from "../admin/toastConfig";

const useGet = (url) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;
    
    setLoading(true);
    axios.get(url)
      .then((res) => setResponse(res.data))
      .catch((err) => {
        console.log(err);
        notifyError(err.response?.data?.message || "Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { response, loading };
}

export default useGet;
