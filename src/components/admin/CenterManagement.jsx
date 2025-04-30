import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import useGet from '../CustomHooks/useGet';
import { FiEdit2, FiTrash2, FiX, FiMapPin } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { reverseGeocode } from './utils/reverseGeocode';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const CenterManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [formData, setFormData] = useState({
    centerName: '',
    numTutors: '',
    numStudents: '',
    sadarName: '',
    sadarContact: '',
    coordinates: '',
    location: '',
  });
  const [mapCenter, setMapCenter] = useState([17.3850, 78.4867]);
  const [markerPosition, setMarkerPosition] = useState(null);

  const { response: centers, loading } = useGet("http://localhost:3000/adminnoauth/Centers");

  const handleCoordinatesChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, coordinates: value });
    
    if (value) {
      const parts = value.split(/[, ]+/).filter(part => part.trim() !== '');
      
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter([lat, lng]);
          setMarkerPosition([lat, lng]);
          
          reverseGeocode(lat, lng)
            .then((address) => {
              setFormData(prev => ({ ...prev, location: address || '' }));
            })
            .catch((error) => {
              console.error('Error during reverse geocoding:', error);
              setFormData(prev => ({ ...prev, location: 'Could not determine location' }));
            });
          return;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, location: '' }));
    setMarkerPosition(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNewCenter = (newCenter) => {
    // This would be replaced with your API call to add a new center
    console.log('New center to be added:', newCenter);
    // setCenters([...centers, newCenter]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      // This would be replaced with your API call to delete a center
      console.log('Center to be deleted:', id);
      // setCenters(centers.filter(center => center.id !== id));
    }
  };

  if (loading) return <p>Loading centers...</p>;
  if (!centers) return <p>No centers found.</p>;

  const filteredCenters = centers.filter(center => {
    const matchesSearch = (center.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || center.area === selectedArea;
    return matchesSearch && matchesArea;
  });

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
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Center
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const { coordinates, ...rest } = formData;
                const [lat, lng] = coordinates.split(/[, ]+/).map(parseFloat);
                const newCenter = {
                  ...rest,
                  coordinates: [lat, lng],
                };
                handleAddNewCenter(newCenter);
                setShowForm(false);
                setFormData({
                  centerName: '',
                  numTutors: '',
                  numStudents: '',
                  sadarName: '',
                  sadarContact: '',
                  coordinates: '',
                  location: '',
                });
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                  <input
                    type="text"
                    name="centerName"
                    value={formData.centerName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tutors</label>
                  <input
                    type="number"
                    name="numTutors"
                    value={formData.numTutors}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
                  <input
                    type="number"
                    name="numStudents"
                    value={formData.numStudents}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sadar Name</label>
                  <input
                    type="text"
                    name="sadarName"
                    value={formData.sadarName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sadar Contact</label>
                  <input
                    type="tel"
                    name="sadarContact"
                    value={formData.sadarContact}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">10-digit mobile number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates (Lat, Lng)</label>
                  <input
                    type="text"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleCoordinatesChange}
                    placeholder="e.g. 17.3850, 78.4867"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <div className="mt-1 flex items-start text-sm text-blue-600">
                    <FiMapPin className="mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Quick tip:</span> Right-click any location on Google Maps and select "Copy coordinates" to paste here
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (Auto-generated)</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300 mt-4">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                  <LocationPicker position={markerPosition} setPosition={(pos) => {
                    if (pos) {
                      setFormData(prev => ({
                        ...prev,
                        coordinates: `${pos[0]}, ${pos[1]}`,
                      }));
                      setMarkerPosition(pos);
                      setMapCenter(pos);
                      
                      reverseGeocode(pos[0], pos[1])
                        .then((address) => {
                          setFormData(prev => ({ ...prev, location: address || '' }));
                        })
                        .catch((error) => {
                          console.error('Error during reverse geocoding:', error);
                          setFormData(prev => ({ ...prev, location: 'Could not determine location' }));
                        });
                    }
                  }} />
                </MapContainer>
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
                    <p className="font-medium">{showDetails.tutors?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Students</p>
                    <p className="font-medium">{showDetails.students?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Coordinates</p>
                    <p className="font-medium">{showDetails.coordinates?.join(', ') || 'N/A'}</p>
                  </div>
                </div>

                {showDetails.coordinates && (
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
                )}
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
                    <div className="text-sm text-gray-900">{center.tutors?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{center.students?.length || 0}</div>
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
  );
};


export default CenterManagement;