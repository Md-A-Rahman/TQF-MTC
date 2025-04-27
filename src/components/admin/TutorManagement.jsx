import { useState } from 'react';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv';
import { notifySuccess } from './toastConfig';
import TutorTable from './TutorTable';
import AddEditTutorForm from './AddEditTutorForm';
import TutorProfileModal from './TutorProfileModal';

const TutorManagement = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileTutor, setProfileTutor] = useState(null);

  const handleAddTutor = (newTutor) => {
    setTutors(prev => [...prev, { id: Date.now(), ...newTutor }]);
    notifySuccess("Tutor added successfully!");
    setShowForm(false);
  };

  const handleEditTutor = (updatedTutor) => {
    setTutors(prev => prev.map(t => t.id === updatedTutor.id ? updatedTutor : t));
    notifySuccess("Tutor updated successfully!");
    setShowForm(false);
  };

  const handleDeleteTutor = (id) => {
    if (window.confirm("Are you sure you want to delete this tutor?")) {
      setTutors(prev => prev.filter(t => t.id !== id));
      notifySuccess("Tutor deleted successfully!");
    }
  };

  const headers = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Qualifications", key: "qualifications" },
    { label: "Centers", key: "centers" },
    { label: "Subjects", key: "subjects" },
    { label: "Session", key: "session" },
    { label: "Timings", key: "timings" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Tutor Management
        </h1>
        <div className="flex gap-4">
          <CSVLink
            data={tutors}
            headers={headers}
            filename="tutors.csv"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Export CSV
          </CSVLink>
          <button
            onClick={() => {
              setIsEditMode(false);
              setSelectedTutor(null);
              setShowForm(true);
            }}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
          >
            Add New Tutor
          </button>
        </div>
      </div>

      <TutorTable
        tutors={tutors}
        onEdit={(tutor) => {
          setSelectedTutor(tutor);
          setIsEditMode(true);
          setShowForm(true);
        }}
        onDelete={handleDeleteTutor}
        onProfileOpen={setProfileTutor}
      />

      {showForm && (
        <AddEditTutorForm
          isEditMode={isEditMode}
          tutorData={selectedTutor}
          onSave={isEditMode ? handleEditTutor : handleAddTutor}
          onClose={() => setShowForm(false)}
        />
      )}

      {profileTutor && (
        <TutorProfileModal
          tutor={profileTutor}
          onClose={() => setProfileTutor(null)}
        />
      )}
    </div>
  );
};

export default TutorManagement;
