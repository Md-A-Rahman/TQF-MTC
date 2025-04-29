import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiBook, FiMapPin, FiClock, FiUpload, FiX, FiDownload, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi'
import Papa from 'papaparse'

const TutorManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [showProfile, setShowProfile] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCenter, setSelectedCenter] = useState('')
  const itemsPerPage = 10

  // Sample tutor data
  const tutors = [
    {
      id: 1,
      fullName: 'Ahmed Khan',
      email: 'ahmed.khan@example.com',
      phone: '9876543210',
      qualifications: 'M.A. Islamic Studies',
      center: 'Malakpet Center',
      subjects: ['Islamic Studies', 'Arabic'],
      sessionType: 'arabic',
      sessionTiming: 'after_fajr',
      joinDate: '2023-01-15',
      status: 'active'
    },
    // Add more sample tutors...
  ].concat(Array(20).fill(null).map((_, index) => ({
    id: index + 2,
    fullName: `Tutor ${index + 2}`,
    email: `tutor${index + 2}@example.com`,
    phone: `987654${(3210 + index).toString().padStart(4, '0')}`,
    qualifications: 'B.Ed',
    center: index % 2 === 0 ? 'Malakpet Center' : 'Mehdipatnam Center',
    subjects: ['Mathematics', 'Science'],
    sessionType: 'tuition',
    sessionTiming: 'after_zohar',
    joinDate: '2023-01-15',
    status: 'active'
  })))

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualifications: '',
    assignmentInfo: '',
    assignedCenter: '',
    assignedSubjects: [],
    sessionType: '',
    sessionTiming: '',
    aadharNumber: '',
    aadharPhoto: null,
    bankAccountNumber: '',
    bankIFSC: '',
    bankPassbookPhoto: null,
    certificates: null,
    memos: null,
    resume: null,
    password: 'tutor@123'
  })

  const centers = [
    { id: 1, name: 'Malakpet Center' },
    { id: 2, name: 'Mehdipatnam Center' },
  ]

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'Social Studies',
    'Islamic Studies',
    'Urdu',
    'Hindi'
  ]

  const handleChange = (e) => {
    const { name, value, type } = e.target

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: e.target.files[0]
      })
    } else if (type === 'checkbox') {
      const updatedSubjects = formData.assignedSubjects.includes(value)
        ? formData.assignedSubjects.filter(subject => subject !== value)
        : [...formData.assignedSubjects, value]
      
      setFormData({
        ...formData,
        assignedSubjects: updatedSubjects
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setShowForm(false)
  }

  const handleExportCSV = () => {
    const data = tutors.map(tutor => ({
      'Full Name': tutor.fullName,
      'Email': tutor.email,
      'Phone': tutor.phone,
      'Center': tutor.center,
      'Subjects': tutor.subjects.join(', '),
      'Session Type': tutor.sessionType,
      'Session Timing': tutor.sessionTiming,
      'Join Date': tutor.joinDate,
      'Status': tutor.status
    }))

    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'tutors.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter tutors based on search term and selected center
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.phone.includes(searchTerm)
    const matchesCenter = !selectedCenter || tutor.center === selectedCenter
    return matchesSearch && matchesCenter
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTutors = filteredTutors.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tutor Management
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <FiDownload className="mr-2" /> Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Add New Tutor
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-64">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">All Centers</option>
                {centers.map(center => (
                  <option key={center.id} value={center.name}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tutors Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Center
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTutors.map((tutor) => (
                <tr
                  key={tutor.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setShowProfile(tutor)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                        {tutor.fullName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tutor.fullName}</div>
                        <div className="text-sm text-gray-500">{tutor.qualifications}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tutor.email}</div>
                    <div className="text-sm text-gray-500">{tutor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tutor.center}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{tutor.sessionType}</div>
                    <div className="text-sm text-gray-500 capitalize">{tutor.sessionTiming.replace(/_/g, ' ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {tutor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => console.log('Edit tutor:', tutor.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => console.log('Delete tutor:', tutor.id)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredTutors.length)}
              </span>{' '}
              of <span className="font-medium">{filteredTutors.length}</span> results
            </span>
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Tutor Form Modal */}
      <AnimatePresence>
        {showForm && (
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
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Tutor
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiUser size={18} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiMail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiPhone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">10-digit mobile number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Default password: tutor@123</p>
                  </div>
                </div>

                {/* Qualifications and Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualifications
                    </label>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignment Information
                    </label>
                    <textarea
                      name="assignmentInfo"
                      value={formData.assignmentInfo}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Center and Subjects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Center
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiMapPin size={18} />
                      </div>
                      <select
                        name="assignedCenter"
                        value={formData.assignedCenter}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select a center</option>
                        {centers.map(center => (
                          <option key={center.id} value={center.id}>
                            {center.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Subjects
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {subjects.map(subject => (
                        <label key={subject} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="assignedSubjects"
                            value={subject}
                            checked={formData.assignedSubjects.includes(subject)}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiBook size={18} />
                      </div>
                      <select
                        name="sessionType"
                        value={formData.sessionType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select session type</option>
                        <option value="arabic">Arabic</option>
                        <option value="tuition">Tuition</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timing
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiClock size={18} />
                      </div>
                      <select
                        name="sessionTiming"
                        value={formData.sessionTiming}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select timing</option>
                        <option value="after_fajr">After Fajr</option>
                        <option value="after_zohar">After Zohar</option>
                        <option value="after_asar">After Asar</option>
                        <option value="after_maghrib">After Maghrib</option>
                        <option value="after_isha">After Isha</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificates
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="certificates"
                          onChange={handleChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="certificates"
                          required
                        />
                        <label
                          htmlFor="certificates"
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <FiUpload className="mr-2" />
                          <span className="text-sm">Upload Certificates</span>
                        </label>
                        {formData.certificates && (
                          <p className="mt-1 text-sm text-gray-500">
                            {formData.certificates.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Memos
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="memos"
                          onChange={handleChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="memos"
                          required
                        />
                        <label
                          htmlFor="memos"
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <FiUpload className="mr-2" />
                          <span className="text-sm">Upload Memos</span>
                        </label>
                        {formData.memos && (
                          <p className="mt-1 text-sm text-gray-500">
                            {formData.memos.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resume
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="resume"
                          onChange={handleChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="resume"
                          required
                        />
                        <label
                          htmlFor="resume"
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <FiUpload className="mr-2" />
                          <span className="text-sm">Upload Resume</span>
                        </label>
                        {formData.resume && (
                          <p className="mt-1 text-sm text-gray-500">
                            {formData.resume.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* New fields for Aadhar and Bank details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      pattern="[0-9]{4} [0-9]{4} [0-9]{4}"
                      placeholder="1234 5678 9012"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Card Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="aadharPhoto"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                        id="aadharPhoto"
                        required
                      />
                      <label
                        htmlFor="aadharPhoto"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <FiUpload className="mr-2" />
                        <span className="text-sm">Upload Aadhar Photo</span>
                      </label>
                      {formData.aadharPhoto && (
                        <p className="mt-1 text-sm text-gray-500">
                          {formData.aadharPhoto.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      name="bankIFSC"
                      value={formData.bankIFSC}
                      onChange={handleChange}
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                      placeholder="ABCD0123456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Passbook Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="bankPassbookPhoto"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                        id="bankPassbookPhoto"
                        required
                      />
                      <label
                        htmlFor="bankPassbookPhoto"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <FiUpload className="mr-2" />
                        <span className="text-sm">Upload Passbook Photo</span>
                      </label>
                      {formData.bankPassbookPhoto && (
                        <p className="mt-1 text-sm text-gray-500">
                          {formData.bankPassbookPhoto.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
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
                    Add Tutor
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutor Profile Modal */}
      <AnimatePresence>
        {showProfile && (
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
                  Tutor Profile
                </h2>
                <button
                  onClick={() => setShowProfile(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                    {showProfile.fullName.charAt(0)}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900">{showProfile.fullName}</h3>
                    <p className="text-gray-500">{showProfile.qualifications}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{showProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{showProfile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Center</p>
                    <p className="font-medium">{showProfile.center}</p>
                
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="font-medium">{showProfile.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session Type</p>
                    <p className="font-medium capitalize">{showProfile.sessionType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session Timing</p>
                    <p className="font-medium capitalize">{showProfile.sessionTiming.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {showProfile.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TutorManagement

