import { motion } from 'framer-motion'
import { FiSearch, FiUser } from 'react-icons/fi'
import { useState } from 'react'

const TutorStudents = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Sample student data
  const students = [
    {
      id: 1,
      name: 'Aisha Khan',
      grade: '8th',
      subjects: ['Mathematics', 'Science'],
      attendance: '90%',
      performance: 'Excellent'
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      grade: '7th',
      subjects: ['English', 'Social Studies'],
      attendance: '85%',
      performance: 'Good'
    },
    // Add more sample students...
  ]

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
          My Students
        </h1>
        <div className="w-64">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-4">
                <FiUser size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">Grade {student.grade}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.subjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-accent-100 text-accent-600 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="font-semibold text-gray-900">{student.attendance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className="font-semibold text-gray-900">{student.performance}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TutorStudents