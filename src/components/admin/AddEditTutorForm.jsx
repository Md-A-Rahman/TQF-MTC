import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const centers = [
  { id: 1, name: 'Malakpet Center' },
  { id: 2, name: 'Mehdipatnam Center' },
  { id: 3, name: 'Tolichowki Center' }
];

const subjects = [
  'Mathematics', 'Science', 'English', 'Social Studies', 'Islamic Studies', 'Urdu', 'Arabic'
];

const timings = ['Post Fajr', 'Post Zohar', 'Post Asar', 'Post Maghrib', 'Post Isha'];

const AddEditTutorForm = ({ isEditMode, tutorData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualifications: '',
    centers: [],
    subjects: [],
    session: '',
    timings: [],
    academicDocs: [],
    aadharCard: null,
    resume: null
  });

  useEffect(() => {
    if (isEditMode && tutorData) {
      setFormData({
        ...tutorData,
        academicDocs: tutorData.academicDocs || [],
        aadharCard: tutorData.aadharCard || null,
        resume: tutorData.resume || null
      });
    }
  }, [isEditMode, tutorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e, field) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleFileChange = (e, field, multiple = false) => {
    const files = multiple ? Array.from(e.target.files) : e.target.files[0];
    setFormData(prev => ({ ...prev, [field]: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.resume) {
      alert("Resume is mandatory!");
      return;
    }

    onSave(formData);
  };

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
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700">
            {isEditMode ? 'Edit Tutor' : 'Add New Tutor'}
          </h2>
          <button onClick={onClose} className="hover:text-red-600">
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="input"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
            pattern="[0-9]{10}"
            required
          />
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="Qualifications"
            className="input"
            required
          />

          {/* Centers */}
          <select
            multiple
            name="centers"
            value={formData.centers}
            onChange={(e) => handleMultiSelect(e, 'centers')}
            className="input"
            required
          >
            {centers.map(center => (
              <option key={center.id} value={center.name}>{center.name}</option>
            ))}
          </select>

          {/* Subjects */}
          <select
            multiple
            name="subjects"
            value={formData.subjects}
            onChange={(e) => handleMultiSelect(e, 'subjects')}
            className="input"
            required
          >
            {subjects.map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>

          {/* Session */}
          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Session</option>
            <option value="Arabic">Arabic</option>
            <option value="Tuition">Tuition</option>
          </select>

          {/* Timings */}
          <select
            multiple
            name="timings"
            value={formData.timings}
            onChange={(e) => handleMultiSelect(e, 'timings')}
            className="input"
            required
          >
            {timings.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          {/* Academic Documents */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 text-sm">Academic Documents</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'academicDocs', true)}
              className="text-sm"
            />
            {formData.academicDocs.length > 0 && (
              <p className="text-xs text-green-600">
                {formData.academicDocs.length} document(s) selected
              </p>
            )}
          </div>

          {/* Aadhar Card */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 text-sm">Aadhar Card</label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => handleFileChange(e, 'aadharCard')}
              className="text-sm"
            />
            {formData.aadharCard && (
              <p className="text-xs text-green-600">Selected: {formData.aadharCard.name}</p>
            )}
          </div>

          {/* Resume */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 text-sm">Resume <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, 'resume')}
              className="text-sm"
              required
            />
            {formData.resume && (
              <p className="text-xs text-green-600">Selected: {formData.resume.name}</p>
            )}
          </div>

          {/* Submit */}
          <div className="col-span-full flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Update Tutor' : 'Add Tutor'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddEditTutorForm;
