import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit2, Trash2, X } from 'lucide-react';

// Sample initial data for demonstration
const initialCenters = [
  {
    id: '1',
    name: 'Masjid-e-Ali Center',
    location: 'Malakpet, Hyderabad',
    coordinates: [17.3850, 78.4867],
    tutors: 5,
    students: 50,
    contactperson: 'Ahmed Khan',
    number: '9876543210',
    area: 'south',
    city: 'Hyderabad'
  },
  {
    id: '2',
    name: 'Masjid-e-Hussain Center',
    location: 'Mehdipatnam, Hyderabad',
    coordinates: [17.3937, 78.4377],
    tutors: 4,
    students: 45,
    contactperson: 'Rahul Kumar',
    number: '9876543211',
    area: 'west',
    city: 'Hyderabad'
  }
];

function CenterManagement() {
  const [centers, setCenters] = useState(initialCenters);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    number: '',
    tutors: '',
    students: '',
    contactperson: '',
    city: 'Hyderabad'
  });
  const [position, setPosition] = useState([17.3850, 78.4867]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new center object
    const newCenter = {
      id: `center-${Date.now()}`,
      name: formData.name,
      location: formData.location,
      coordinates: position,
      tutors: parseInt(formData.tutors) || 0,
      students: parseInt(formData.students) || 0,
      contactperson: formData.contactperson,
      number: formData.number,
      area: selectedArea || 'north',
      city: formData.city || 'Hyderabad'
    };

    // Add the new center to the centers state
    setCenters([...centers, newCenter]);
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      number: '',
      tutors: '',
      students: '',
      contactperson: '',
      city: 'Hyderabad'
    });
    setPosition([17.3850, 78.4867]);
    setSelectedArea('');
    setShowForm(false);
    setIsSubmitting(false);
    
    // Show success message
    alert("Center added successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      setCenters(centers.filter(center => center.id !== id));
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || center.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  // Mocked map component (since we can't use real Leaflet in this context)
  const MockMapContainer = ({ children, center, zoom, style }) => (
    <div style={{ ...style, backgroundColor: '#e5e7eb', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div className="text-gray-500 mb-2">Map View</div>
        <div className="text-xs text-gray-400">
          Location: {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </div>
      </div>
      {children}
    </div>
  );

  const MockTileLayer = () => null;
  
  const MockMarker = () => (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)'
    }}>
      <MapPin size={24} className="text-red-500" />
    </div>
  );

  const LocationPicker = ({ position, setPosition }) => {
    const handleMapClick = (e) => {
      // Simulate a random position near the current one
      const lat = position[0] + (Math.random() - 0.5) * 0.02;
      const lng = position[1] + (Math.random() - 0.5) * 0.02;
      setPosition([lat, lng]);
    };

    return (
      <div 
        onClick={handleMapClick}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          cursor: 'pointer'
        }}
      >
        {position ? <MockMarker position={position} /> : null}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Center Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add New Center
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Add New Center
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Tutors
                  </label>
                  <input
                    type="number"
                    name="tutors"
                    value={formData.tutors}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    name="students"
                    value={formData.students}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sadar Name
                  </label>
                  <input
                    type="text"
                    name="contactperson"
                    value={formData.contactperson}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sadar Contact
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">10-digit mobile number</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="north">North Hyderabad</option>
                    <option value="south">South Hyderabad</option>
                    <option value="east">East Hyderabad</option>
                    <option value="west">West Hyderabad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Center Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  placeholder="Enter location address"
                />
                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300">
                  <MockMapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <MockTileLayer />
                    <LocationPicker position={position} setPosition={setPosition} />
                  </MockMapContainer>
                </div>
                <p className="mt-1 text-sm text-gray-500">Click on the map to select location</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add Center'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Center Details
                </h2>
                <button
                  onClick={() => setShowDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Center Name</p>
                    <p className="font-medium">{showDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{showDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Tutors</p>
                    <p className="font-medium">{showDetails.tutors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Students</p>
                    <p className="font-medium">{showDetails.students}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sadar Name</p>
                    <p className="font-medium">{showDetails.contactperson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sadar Contact</p>
                    <p className="font-medium">{showDetails.number}</p>
                  </div>
                </div>

                <div className="h-[200px] rounded-lg overflow-hidden border border-gray-300 mt-4">
                  <MockMapContainer
                    center={showDetails.coordinates || [17.3850, 78.4867]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <MockTileLayer />
                    <MockMarker position={showDetails.coordinates || [17.3850, 78.4867]} />
                  </MockMapContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Areas</option>
              <option value="north">North Hyderabad</option>
              <option value="south">South Hyderabad</option>
              <option value="east">East Hyderabad</option>
              <option value="west">West Hyderabad</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Center Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCenters.map((center) => (
                <tr
                  key={center.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setShowDetails(center)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{center.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="mr-2" size={16} />
                      {center.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.tutors}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.students}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => console.log('Edit center:', center.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(center.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CenterManagement;






// import { useState, useEffect } from 'react'
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
// import { motion, AnimatePresence } from 'framer-motion'
// import useGet from '../CustomHooks/useGet'
// import usePost from '../CustomHooks/usePost'

// import { FiEdit2, FiTrash2, FiX, FiMapPin } from 'react-icons/fi'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'

// // Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// })

// const LocationPicker = ({ position, setPosition }) => {
//   useMapEvents({
//     click: (e) => {
//       setPosition([e.latlng.lat, e.latlng.lng])
//     },
//   })

//   return position ? <Marker position={position} /> : null
// }

// const CenterManagement = () => {
//   const [showForm, setShowForm] = useState(false)
//   const [showDetails, setShowDetails] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedArea, setSelectedArea] = useState('')
//   const [formData, setFormData] = useState({
//     name: '',
//     centerID: '',
//     location: '',
//     number: '',
//     tutors: '',
//     students: '',
//     contactperson: '',
//     city: 'Hyderabad', // Default city
//   })
//   const [position, setPosition] = useState([17.3850, 78.4867])
//   const [refreshData, setRefreshData] = useState(false)

//   const { response: centers, loading, refetch } = useGet("http://localhost:3000/adminnoauth/Centers");
//   const { post, response: postResponse, loadingPost } = usePost();

//   // Refetch centers when a new one is added
//   useEffect(() => {
//     if (postResponse) {
//       refetch();
//     }
//   }, [postResponse, refetch]);

//   if (loading) return (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );
  
//   if (!centers) return <p className="text-center text-gray-500 my-8">No centers found.</p>;



//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const newCenter = {
//         name: formData.name,
//         location: formData.location,
//         city: formData.city || 'Hyderabad',
//         number: formData.number,
//         contactperson: formData.contactperson
//     };

//     try {
//         const response = await post("http://localhost:3000/adminnoauth/addCenter", newCenter);
        
//         if (response) {
//             // Reset form
//             setShowForm(false);
//             setFormData({
//                 name: '',
//                 centerID: '',
//                 location: '',
//                 number: '',
//                 tutors: '',
//                 students: '',
//                 contactperson: '',
//                 city: 'Hyderabad',
//             });
//             setPosition([17.3850, 78.4867]);
//             setSelectedArea('');
            
//             // Trigger a refresh of the centers list
//             refetch();
            
//             // Show success message
//             alert("Center added successfully!");
//         }
//     } catch (error) {
//         console.error("Error adding center:", error);
//         alert(error.response?.data?.message || "Failed to add center. Please try again.");
//     }
// };




//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()
    
//   //   // Format data according to what the backend expects
//   //   const newCenter = {
//   //     name: formData.name,
//   //     location: formData.location,
//   //     city: formData.city || 'Hyderabad',
//   //     number: formData.number,
//   //     contactperson: formData.contactperson,
//   //     tutors: [], // Empty array as per model
//   //     students: [] // Empty array as per model
//   //   }

//   //   try {
//   //     await post("http://localhost:3000/adminnoauth/addCenter", newCenter);
      
//   //     // Reset form after successful submission
//   //     setShowForm(false);
//   //     setFormData({
//   //       name: '',
//   //       centerID: '',
//   //       location: '',
//   //       number: '',
//   //       tutors: '',
//   //       students: '',
//   //       contactperson: '',
//   //       city: 'Hyderabad',
//   //     });
//   //     setPosition([17.3850, 78.4867]); // Reset position
//   //     setSelectedArea(''); // Reset area
      
//   //     // Trigger a refresh of the centers list
//   //     setRefreshData(prev => !prev);
      
//   //     // Show success feedback (you could add a toast notification here)
//   //     alert("Center added successfully!");
//   //   } catch (error) {
//   //     console.error("Error adding center:", error);
//   //     // Show error feedback
//   //     alert("Failed to add center. Please try again.");
//   //   }
//   // }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this center?')) {
//       // Here you would call the API to delete the center
//       // Then refetch the centers list
//       console.log("Deleting center:", id);
//       // After successful deletion, refetch centers
//       refetch();
//     }
//   }

//   const filteredCenters = centers.filter(center => {
//     const matchesSearch = (center.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
//     const matchesArea = !selectedArea || center.area === selectedArea
//     return matchesSearch && matchesArea
//   })

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Center Management
//         </h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
//         >
//           Add New Center
//         </button>
//       </div>

//       {/* Form Modal */}
//       {showForm && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//         >
//           <motion.div
//             initial={{ scale: 0.95 }}
//             animate={{ scale: 1 }}
//             className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//           >
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
//               Add New Center
//             </h2>
            
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Center Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Number of Tutors
//                   </label>
//                   <input
//                     type="number"
//                     name="tutors"
//                     value={formData.tutors}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Number of Students
//                   </label>
//                   <input
//                     type="number"
//                     name="students"
//                     value={formData.students}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Sadar Name
//                   </label>
//                   <input
//                     type="text"
//                     name="contactperson"
//                     value={formData.contactperson}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Sadar Contact
//                   </label>
//                   <input
//                     type="tel"
//                     name="number"
//                     value={formData.number}
//                     onChange={handleChange}
//                     pattern="[0-9]{10}"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     required
//                   />
//                   <p className="mt-1 text-sm text-gray-500">10-digit mobile number</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Center Location
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   required
//                   placeholder="Enter location address"
//                 />
//                 <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300">
//                   <MapContainer
//                     center={position}
//                     zoom={13}
//                     style={{ height: '100%', width: '100%' }}
//                   >
//                     <TileLayer
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     <LocationPicker position={position} setPosition={setPosition} />
//                   </MapContainer>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-500">Click on the map to select location</p>
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                   disabled={loadingPost}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg ${
//                     loadingPost ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//                   disabled={loadingPost}
//                 >
//                   {loadingPost ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Adding...
//                     </span>
//                   ) : (
//                     'Add Center'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Details Modal */}
//       <AnimatePresence>
//         {showDetails && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.95 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.95 }}
//               className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl"
//             >
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Center Details
//                 </h2>
//                 <button
//                   onClick={() => setShowDetails(null)}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Center Name</p>
//                     <p className="font-medium">{showDetails.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Location</p>
//                     <p className="font-medium">{showDetails.location}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Number of Tutors</p>
//                     <p className="font-medium">{showDetails.tutors?.length || 0}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Number of Students</p>
//                     <p className="font-medium">{showDetails.students?.length || 0}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Sadar Name</p>
//                     <p className="font-medium">{showDetails.contactperson}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Sadar Contact</p>
//                     <p className="font-medium">{showDetails.number}</p>
//                   </div>
//                 </div>

//                 <div className="h-[200px] rounded-lg overflow-hidden border border-gray-300 mt-4">
//                   <MapContainer
//                     center={showDetails.coordinates || [17.3850, 78.4867]}
//                     zoom={13}
//                     style={{ height: '100%', width: '100%' }}
//                   >
//                     <TileLayer
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     <Marker position={showDetails.coordinates || [17.3850, 78.4867]} />
//                   </MapContainer>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="mb-6">
//           <div className="flex gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Search centers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             />
//             <select
//               value={selectedArea}
//               onChange={(e) => setSelectedArea(e.target.value)}
//               className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               <option value="">All Areas</option>
//               <option value="north">North Hyderabad</option>
//               <option value="south">South Hyderabad</option>
//               <option value="east">East Hyderabad</option>
//               <option value="west">West Hyderabad</option>
//             </select>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Center Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Tutors
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Students
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCenters.map((center) => (
//                 <tr
//                   key={center._id || center.id}
//                   className="hover:bg-gray-50 transition-colors cursor-pointer"
//                   onClick={() => setShowDetails(center)}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{center.name}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500 flex items-center">
//                       <FiMapPin className="mr-2" />
//                       {center.location}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{center.tutors?.length || 0}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{center.students?.length || 0}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
//                       <button
//                         onClick={() => console.log('Edit center:', center._id || center.id)}
//                         className="text-blue-600 hover:text-blue-800 transition-colors"
//                       >
//                         <FiEdit2 size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(center._id || center.id)}
//                         className="text-red-600 hover:text-red-800 transition-colors"
//                       >
//                         <FiTrash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CenterManagement







// // import { useState } from 'react'
// // import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
// // import { motion, AnimatePresence } from 'framer-motion'
// // import useGet from '../CustomHooks/useGet'
// // import usePost from '../CustomHooks/usePost'

// // import { FiEdit2, FiTrash2, FiX, FiMapPin } from 'react-icons/fi'
// // import 'leaflet/dist/leaflet.css'
// // import L from 'leaflet'

// // // Fix for default marker icon
// // delete L.Icon.Default.prototype._getIconUrl
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // })

// // const LocationPicker = ({ position, setPosition }) => {
// //   useMapEvents({
// //     click: (e) => {
// //       setPosition([e.latlng.lat, e.latlng.lng])
// //     },
// //   })

// //   return position ? <Marker position={position} /> : null
// // }

// // // Sample data for demonstration
// // // const sampleCenters = [
// // //   {
// // //     id: 1,
// // //     name: 'Masjid-e-Ali Center',
// // //     location: 'Malakpet, Hyderabad',
// // //     coordinates: [17.3850, 78.4867],
// // //     tutors: 5,
// // //     students: 50,
// // //     sadarName: 'Ahmed Khan',
// // //     number: '9876543210',
// // //     area: 'south'
// // //   },
// // //   {
// // //     id: 2,
// // //     name: 'Masjid-e-Hussain Center',
// // //     location: 'Mehdipatnam, Hyderabad',
// // //     coordinates: [17.3937, 78.4377],
// // //     tutors: 4,
// // //     students: 45,
// // //     sadarName: 'Rahul Kumar',
// // //     number: '9876543211',
// // //     area: 'west'
// // //   },
// // // ]

// // const CenterManagement = () => {
// //   const [showForm, setShowForm] = useState(false)
// //   // const [centers, centers] = useState(null)
// //   const [showDetails, setShowDetails] = useState(null)
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [selectedArea, setSelectedArea] = useState('')
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     centerID: '',
// //     location: '',
// //     number: '',
// //     tutors: '',
// //     students: '',
// //     contactperson: '',
// //     // location: null
// //   })
// //   const [position, setPosition] = useState([17.3850, 78.4867])

// //   const { response: centers, loading } = useGet("http://localhost:3000/adminnoauth/Centers");
// //   const { post, loadingPost } = usePost();

// //   if (loading) return <p>Loading center...</p>;
// //   console.log("From the CenterManagement..!!!",centers)
// //   if (!centers) return <p>No center found.</p>;
  

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     const newCenter = {
// //       centerId: formData.centerID || `CENTER${Date.now()}`, // Generate a unique ID if not provided
// //       name: formData.name,
// //       location: formData.location,
// //       coordinates: position,
// //       tutors: formData.tutors || [],
// //       students: formData.students || [],
// //       contactperson: formData.contactperson,
// //       number: formData.number,
// //       // area: selectedArea || 'north' // Default to north if not selected
// //     }

// //     try {
// //       const response = await post("http://localhost:3000/adminnoauth/addCenter", newCenter);
// //       if (response) {
// //         setShowForm(false);
// //         setFormData({
// //           name: '',
// //           centerID: '',
// //           location: '',
// //           number: '',
// //           tutors: '',
// //           students: '',
// //           contactperson: '',
// //         });
// //         setPosition([17.3850, 78.4867]); // Reset position
// //         setSelectedArea(''); // Reset area
// //       }
// //     } catch (error) {
// //       console.error("Error adding center:", error);
// //     }
// //   }


// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     })
// //   }

// //   const handleDelete = (id) => {
// //     if (window.confirm('Are you sure you want to delete this center?')) {
// //       centers(centers.filter(center => center.id !== id))
// //     }
// //   }


// //   const filteredCenters = centers.filter(center => {
// //     const matchesSearch = (center.name.toLowerCase() || "").includes(searchTerm.toLowerCase())
// //     const matchesArea = !selectedArea || center.area === selectedArea
// //     return matchesSearch && matchesArea
// //   })

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //           Center Management
// //         </h1>
// //         <button
// //           onClick={() => setShowForm(true)}
// //           className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
// //         >
// //           Add New Center
// //         </button>
// //       </div>

// //       {/* Form Modal */}
// //       {showForm && (
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
// //         >
// //           <motion.div
// //             initial={{ scale: 0.95 }}
// //             animate={{ scale: 1 }}
// //             className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
// //           >
// //             <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
// //               Add New Center
// //             </h2>
            
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Center Name
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Number of Tutors
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="tutors"
// //                     value={formData.tutors}
// //                     onChange={handleChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     // required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Number of Students
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="students"
// //                     value={formData.students}
// //                     onChange={handleChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     // required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Sadar Name
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="contactperson"
// //                     value={formData.contactperson}
// //                     onChange={handleChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Sadar Contact
// //                   </label>
// //                   <input
// //                     type="tel"
// //                     name="number"
// //                     value={formData.number}
// //                     onChange={handleChange}
// //                     pattern="[0-9]{10}"
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     required
// //                   />
// //                   <p className="mt-1 text-sm text-gray-500">10-digit mobile number</p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Center Location
// //                 </label>
// //                 <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300">
// //                 <input
// //                     type="tel"
// //                     name="location"
// //                     value={formData.location}
// //                     onChange={handleChange}
// //                     className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //                     required
// //                   />
// //                   <MapContainer
// //                     center={position}
// //                     zoom={13}
// //                     style={{ height: '100%', width: '100%' }}
// //                   >
// //                     <TileLayer
// //                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //                     />
// //                     <LocationPicker position={position} setPosition={setPosition} />
// //                   </MapContainer>
// //                 </div>
// //                 {position} <br />
// //                 {position}
// //                 <p className="mt-1 text-sm text-gray-500">Click on the map to select location</p>
// //               </div>

// //               <div className="flex justify-end space-x-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForm(false)}
// //                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
// //                 >
// //                   Add Center
// //                 </button>
// //               </div>
// //             </form>
// //           </motion.div>
// //         </motion.div>
// //       )}

// //       {/* Details Modal */}
// //       <AnimatePresence>
// //         {showDetails && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
// //           >
// //             <motion.div
// //               initial={{ scale: 0.95 }}
// //               animate={{ scale: 1 }}
// //               exit={{ scale: 0.95 }}
// //               className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl"
// //             >
// //               <div className="flex justify-between items-start mb-6">
// //                 <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //                   Center Details
// //                 </h2>
// //                 <button
// //                   onClick={() => setShowDetails(null)}
// //                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //                 >
// //                   <FiX size={20} />
// //                 </button>
// //               </div>

// //               <div className="space-y-4">
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <p className="text-sm text-gray-500">Center Name</p>
// //                     <p className="font-medium">{showDetails.name}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-500">Location</p>
// //                     <p className="font-medium">{showDetails.location}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-500">Number of Tutors</p>
// //                     <p className="font-medium">{showDetails.tutors}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-500">Number of Students</p>
// //                     <p className="font-medium">{showDetails.students}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-500">Sadar Name</p>
// //                     <p className="font-medium">{showDetails.contactperson}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-500">Sadar Contact</p>
// //                     <p className="font-medium">{showDetails.number}</p>
// //                   </div>
// //                 </div>

// //                 <div className="h-[200px] rounded-lg overflow-hidden border border-gray-300 mt-4">
// //                   <MapContainer
// //                     center={showDetails.coordinates}
// //                     zoom={13}
// //                     style={{ height: '100%', width: '100%' }}
// //                   >
// //                     <TileLayer
// //                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //                     />
// //                     <Marker position={showDetails.coordinates} />
// //                   </MapContainer>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       <div className="bg-white rounded-xl shadow-lg p-6">
// //         <div className="mb-6">
// //           <div className="flex gap-4 mb-4">
// //             <input
// //               type="text"
// //               placeholder="Search centers..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //             />
// //             <select
// //               value={selectedArea}
// //               onChange={(e) => setSelectedArea(e.target.value)}
// //               className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// //             >
// //               <option value="">All Areas</option>
// //               <option value="north">North Hyderabad</option>
// //               <option value="south">South Hyderabad</option>
// //               <option value="east">East Hyderabad</option>
// //               <option value="west">West Hyderabad</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead>
// //               <tr className="bg-gray-50">
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Center Name
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Location
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Tutors
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Students
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {filteredCenters.map((center) => (
// //                 <tr
// //                   key={center.id}
// //                   className="hover:bg-gray-50 transition-colors cursor-pointer"
// //                   onClick={() => setShowDetails(center)}
// //                 >
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm font-medium text-gray-900">{center.name}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm text-gray-500 flex items-center">
// //                       <FiMapPin className="mr-2" />
// //                       {center.location}
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm text-gray-900">{center.tutors.length}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm text-gray-900">{center.students.length}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
// //                       <button
// //                         onClick={() => console.log('Edit center:', center.id)}
// //                         className="text-blue-600 hover:text-blue-800 transition-colors"
// //                       >
// //                         <FiEdit2 size={18} />
// //                       </button>
// //                       <button
// //                         onClick={() => handleDelete(center.id)}
// //                         className="text-red-600 hover:text-red-800 transition-colors"
// //                       >
// //                         <FiTrash2 size={18} />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default CenterManagement