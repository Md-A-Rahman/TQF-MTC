import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ITEMS_PER_PAGE = 10;

const TutorTable = ({ tutors, onEdit, onDelete, onProfileOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tutors.length / ITEMS_PER_PAGE);

  const handleChangePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedTutors = tutors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Session</th>
            <th className="p-3 text-left">Centers</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedTutors.map((tutor) => (
            <tr
              key={tutor.id}
              className="border-b hover:bg-purple-50 transition"
            >
              <td
                onClick={() => onProfileOpen(tutor)}
                className="p-3 cursor-pointer text-purple-700 hover:underline"
              >
                {tutor.fullName}
              </td>
              <td className="p-3">{tutor.email}</td>
              <td className="p-3">{tutor.phone}</td>
              <td className="p-3">{tutor.session}</td>
              <td className="p-3">{tutor.centers ? tutor.centers.join(', ') : '-'}</td>
              <td className="p-3 flex justify-center gap-3">
                <button
                  onClick={() => onEdit(tutor)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(tutor.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleChangePage(idx + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === idx + 1
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorTable;
