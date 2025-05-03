import { useState } from "react";
import axios from "axios";
import { notifyError } from "../admin/toastConfig";

const usePost = () => {
  const [response, setResponse] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState(null);

  const post = async (url, payload) => {
    setLoadingPost(true);
    setError(null);
    try {
      const res = await axios.post(url, payload);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      const errorMessage = err.response?.data?.message || "Something went wrong";
      notifyError(errorMessage);
      throw err;
    } finally {
      setLoadingPost(false);
    }
  };

  return { post, response, loadingPost, error };
};

export default usePost;












// import { useState } from "react";
// import axios from "axios";
// import { notifyError } from "../admin/toastConfig";

// const usePost = () => {
//   const [response, setResponse] = useState(null);
//   const [loadingPost, setLoadingPost] = useState(false);

//   const post = async (url, payload) => {
//     setLoadingPost(true);
//     try {
//       const res = await axios.post(url, payload);
//       console.log("UsePost Call")
//       setResponse(res.data);
//       // return response;
//       // return {data:res.data};
//     } catch (err) {
//       console.log(err);
//       notifyError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoadingPost(false);
//     }
//   };

//   return { post, response, loadingPost };
// };

// export default usePost;









// import { useState, useEffect } from "react";
// import axios from "axios";
// import { notifyError } from "../admin/toastConfig";

// const usePost = (url, payload) => {
//   const [response, setResponse] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!url || !payload) return;
    
//     setLoading(true);
//     axios.post(url, payload)
//       .then((res) => setResponse(res.data))
//       .catch((err) => {
//         console.log(err);
//         notifyError(err.response?.data?.message || "Something went wrong");
//       })
//       .finally(() => setLoading(false));
//   }, [url, payload]);

//   return { response, loading };
// }

// export default usePost;