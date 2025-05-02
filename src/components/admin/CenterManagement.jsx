import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import useGet from '../CustomHooks/useGet'
import usePost from '../CustomHooks/usePost'

import { FiEdit2, FiTrash2, FiX, FiMapPin } from 'react-icons/fi'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return position ? <Marker position={position} /> : null
}

// Sample data for demonstration
// const sampleCenters = [
//   {
//     id: 1,
//     name: 'Masjid-e-Ali Center',
//     location: 'Malakpet, Hyderabad',
//     coordinates: [17.3850, 78.4867],
//     tutors: 5,
//     students: 50,
//     sadarName: 'Ahmed Khan',
//     number: '9876543210',
//     area: 'south'
//   },
//   {
//     id: 2,
//     name: 'Masjid-e-Hussain Center',
//     location: 'Mehdipatnam, Hyderabad',
//     coordinates: [17.3937, 78.4377],
//     tutors: 4,
//     students: 45,
//     sadarName: 'Rahul Kumar',
//     number: '9876543211',
//     area: 'west'
//   },
// ]

const CenterManagement = () => {
  const [showForm, setShowForm] = useState(false)
  // const [centers, centers] = useState(null)
  const [showDetails, setShowDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    centerID: '',
    location: '',
    number: '',
    tutors: '',
    students: '',
    contactperson: '',
    // location: null
  })
  const [position, setPosition] = useState([17.3850, 78.4867])

  const { response: centers, loading } = useGet("http://localhost:3000/adminnoauth/Centers");
  const { post, loadingPost } = usePost();

  if (loading) return <p>Loading center...</p>;
  console.log("From the CenterManagement..!!!",centers)
  if (!centers) return <p>No center found.</p>;
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newCenter = {
      centerId: formData.centerID || `CENTER${Date.now()}`, // Generate a unique ID if not provided
      name: formData.name,
      location: formData.location,
      coordinates: position,
      tutors: formData.tutors || [],
      students: formData.students || [],
      contactperson: formData.contactperson,
      number: formData.number,
      // area: selectedArea || 'north' // Default to north if not selected
    }

    try {
      const response = await post("http://localhost:3000/adminnoauth/addCenter", newCenter);
      if (response) {
        setShowForm(false);
        setFormData({
          name: '',
          centerID: '',
          location: '',
          number: '',
          tutors: '',
          students: '',
          contactperson: '',
        });
        setPosition([17.3850, 78.4867]); // Reset position
        setSelectedArea(''); // Reset area
      }
    } catch (error) {
      console.error("Error adding center:", error);
    }
  }


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      centers(centers.filter(center => center.id !== id))
    }
  }


  const filteredCenters = centers.filter(center => {
    const matchesSearch = (center.name.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesArea = !selectedArea || center.area === selectedArea
    return matchesSearch && matchesArea
  })

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
                    // required
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
                    // required
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Center Location
                </label>
                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300">
                <input
                    type="tel"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationPicker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
                {position} <br />
                {position}
                <p className="mt-1 text-sm text-gray-500">Click on the map to select location</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Add Center
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
                  <FiX size={20} />
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
                  <MapContainer
                    center={showDetails.coordinates}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={showDetails.coordinates} />
                  </MapContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
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
                      <FiMapPin className="mr-2" />
                      {center.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.tutors.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.students.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => console.log('Edit center:', center.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(center.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FiTrash2 size={18} />
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
  )
}

export default CenterManagement