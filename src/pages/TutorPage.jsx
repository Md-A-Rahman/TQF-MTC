import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TutorDashboard from "../components/tutor/TutorDashboard";
import usePost from "../components/CustomHooks/usePost";

const TutorPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { post, loading,response } = usePost();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && response?.success) {
      if (response.user) {
        const { user, token } = response;
        console.log(user.role)
        if(user.role===2){
          navigate("/admin-dashboard")
        }
        else if(user.role===1){
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          // Accessing Stored Token/User Later
          // const token = localStorage.getItem("token");
          // const user = JSON.parse(localStorage.getItem("user"));
          
          setIsLoggedIn(true);
          navigate("/tutor-dashboard");
        }
      }
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      number: phone,
      password: password,
    };
    // console.log(payload)

    await post("https://tuitioncenter-backend.onrender.com/login", payload);
    // console.log("API called")
    // console.log(result)
    // console.log("response: ",response,"loading: ",loading)

    // if(result.data.user){

    //   const { user, token } = result.data;
  
    //   localStorage.setItem("token", token);
    //   localStorage.setItem("user", JSON.stringify(user));

    //   // Accessing Stored Token/User Later
    //   // const token = localStorage.getItem("token");
    //   // const user = JSON.parse(localStorage.getItem("user"));
  
    //   setIsLoggedIn(true);
    //   navigate("/tutor-dashboard");

    // }

    // else {
    //   setError(result.error.message || "Login failed");
    //   return;
    // }

    // console.log("Msg: ",result.message);
    // console.log("API Response:", result);


    // console.log(user,token,message)
    // console.log("API Response:", result.data.message);
    // console.log("API Response:", result.data.user);
    // console.log("API Response:", result.data.token);

    // const {response,loading}=usePost("http://localhost:3000/login",payload)

    // if (phone === "9876543210" && password === "tutor@123") {
    //   setIsLoggedIn(true);

    // }
    // else {
    //   setError("Invalid credentials. Please try again.");
    // }
  };

  if (isLoggedIn) {
    return <TutorDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-primary-50 pt-24 pb-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-medium p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-4">
              <FiPhone size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tutor Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiPhone size={18} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter 10-digit mobile number
              </p>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full btn bg-gradient-to-r from-accent-600 to-primary-600 text-white hover:from-accent-700 hover:to-primary-700 py-3 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorPage;
