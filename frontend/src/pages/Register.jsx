import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import {
  GraduationCap,
  Briefcase,
  Mail,
  Lock,
  User,
  Building,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Phone
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Student
    university: 'Metropolitan Institute of Technology',
    major: 'Computer Science & AI',
    academicYear: '3rd Year (Junior)',
    careerGoals: 'Machine Learning Engineer & Production Systems',
    skillsSought: 'Machine Learning, PyTorch, System Design',
    // Mentor
    organization: 'DeepTech Innovations',
    designation: 'Senior Lead Architect',
    domain: 'Artificial Intelligence & Machine Learning',
    expertiseSkills: 'Machine Learning, Deep Learning, Cloud Architecture',
    yearsExperience: '8',
    linkedinUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        role
      };
      const res = await register(payload);
      if (res.success) {
        if (role === 'STUDENT') navigate('/student/dashboard');
        else if (role === 'MENTOR') navigate('/mentor/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-xl mx-auto text-center mb-8">
        <div className="flex justify-center mb-3">
          <Logo />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Create Your Platform Account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Join hundreds of students and industry mentors accelerating career outcomes.
        </p>

        {/* Role Selector Tabs */}
        <div className="mt-6 inline-flex p-1 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              role === 'STUDENT'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span>I am a Student (Mentee)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('MENTOR')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              role === 'MENTOR'
                ? 'bg-white text-lavender-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-lavender-600" />
            <span>I am a Mentor</span>
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm">
        
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Common Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={role === 'STUDENT' ? 'e.g. Maya Lin' : 'e.g. Dr. Jane Smith'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password (min. 6 characters) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === 'STUDENT' ? (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Academic & Career Profile
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                    <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                    <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                    <option value="4th Year (Senior)">4th Year (Senior)</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Career Goal
                  </label>
                  <input
                    type="text"
                    name="careerGoals"
                    value={formData.careerGoals}
                    onChange={handleChange}
                    placeholder="e.g. Cloud Engineer"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skills You Want to Learn (Comma-separated)
                </label>
                <input
                  type="text"
                  name="skillsSought"
                  value={formData.skillsSought}
                  onChange={handleChange}
                  placeholder="e.g. PyTorch, Distributed Systems, Algorithms"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-lavender-700">
                Professional Mentor Credentials
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Google, Microsoft, University Lab"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Staff Software Engineer"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Domain Specialization
                  </label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                    <option value="Cloud Architecture & Distributed Systems">Cloud Architecture & Distributed Systems</option>
                    <option value="Data Engineering & Analytics">Data Engineering & Analytics</option>
                    <option value="Cybersecurity & Threat Defense">Cybersecurity & Threat Defense</option>
                    <option value="DevOps & Site Reliability">DevOps & Site Reliability</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    min="1"
                    max="40"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expertise Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  name="expertiseSkills"
                  value={formData.expertiseSkills}
                  onChange={handleChange}
                  placeholder="e.g. Deep Learning, System Design, Kubernetes"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Setting up account...</span>
              ) : (
                <>
                  <span>Complete Registration as {role === 'STUDENT' ? 'Student' : 'Mentor'}</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </>
              )}
            </button>
          </div>

        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-700 hover:underline">
            Sign In here
          </Link>
        </div>

      </div>

    </div>
  );
}
