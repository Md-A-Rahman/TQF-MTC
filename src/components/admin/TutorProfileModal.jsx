import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const TutorProfileModal = ({ tutor, onClose }) => {
  if (!tutor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700">
            Tutor Profile
          </h2>
          <button onClick={onClose} className="hover:text-red-600">
            <FiX size={24} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Full Name</p>
            <p className="font-medium">{tutor.fullName}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Email</p>
            <p className="font-medium">{tutor.email}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Phone</p>
            <p className="font-medium">{tutor.phone}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Qualifications</p>
            <p className="font-medium">{tutor.qualifications}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Session</p>
            <p className="font-medium">{tutor.session}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Centers</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {tutor.centers.map((center, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs"
                >
                  {center}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Subjects</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {tutor.subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Session Timings</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {tutor.timings.map((time, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>

          {/* Academic Docs */}
          {tutor.academicDocs && tutor.academicDocs.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-gray-500 mb-1">Academic Documents</p>
              <ul className="list-disc list-inside text-purple-700 text-sm">
                {tutor.academicDocs.map((file, idx) => (
                  <li key={idx}>{file.name || "Document Uploaded"}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Aadhar Card */}
          {tutor.aadharCard && (
            <div>
              <p className="text-gray-500 mb-1">Aadhar Card</p>
              <p className="text-green-700 text-sm">{tutor.aadharCard.name || "File Uploaded"}</p>
            </div>
          )}

          {/* Resume */}
          {tutor.resume && (
            <div>
              <p className="text-gray-500 mb-1">Resume</p>
              <p className="text-green-700 text-sm">{tutor.resume.name || "File Uploaded"}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TutorProfileModal;
