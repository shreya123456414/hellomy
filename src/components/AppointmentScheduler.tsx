import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Video, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';

interface Appointment {
  id: string;
  type: 'therapy' | 'psychiatrist' | 'counselor' | 'support_group';
  provider: string;
  date: string;
  time: string;
  duration: number;
  format: 'in_person' | 'video' | 'phone';
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  type: 'therapy' | 'psychiatrist' | 'counselor' | 'support_group';
  rating: number;
  availability: string[];
  format: ('in_person' | 'video' | 'phone')[];
  location?: string;
}

export default function AppointmentScheduler() {
  const { state, dispatch } = useApp();
  const theme = themes[state.currentTheme];
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    type: 'therapy',
    format: 'video',
    duration: 60
  });

  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Depression',
      type: 'therapy',
      rating: 4.9,
      availability: ['Mon', 'Wed', 'Fri'],
      format: ['video', 'in_person'],
      location: 'Downtown Medical Center'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Trauma & PTSD',
      type: 'psychiatrist',
      rating: 4.8,
      availability: ['Tue', 'Thu'],
      format: ['video', 'phone', 'in_person'],
      location: 'Wellness Clinic'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez, LCSW',
      specialty: 'Family & Relationship Counseling',
      type: 'counselor',
      rating: 4.7,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      format: ['video', 'in_person'],
      location: 'Community Health Center'
    },
    {
      id: '4',
      name: 'Mindfulness Support Group',
      specialty: 'Group Therapy & Peer Support',
      type: 'support_group',
      rating: 4.6,
      availability: ['Wed', 'Sat'],
      format: ['in_person', 'video'],
      location: 'Community Center'
    }
  ];

  const appointmentTypes = [
    { id: 'therapy', name: 'Individual Therapy', icon: User, color: 'blue' },
    { id: 'psychiatrist', name: 'Psychiatrist', icon: User, color: 'purple' },
    { id: 'counselor', name: 'Counselor', icon: User, color: 'green' },
    { id: 'support_group', name: 'Support Group', icon: User, color: 'orange' }
  ];

  const formatOptions = [
    { id: 'video', name: 'Video Call', icon: Video },
    { id: 'phone', name: 'Phone Call', icon: Phone },
    { id: 'in_person', name: 'In Person', icon: MapPin }
  ];

  const handleScheduleAppointment = () => {
    if (!selectedProvider || !newAppointment.date || !newAppointment.time) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      type: newAppointment.type!,
      provider: selectedProvider.name,
      date: newAppointment.date!,
      time: newAppointment.time!,
      duration: newAppointment.duration || 60,
      format: newAppointment.format!,
      location: newAppointment.format === 'in_person' ? selectedProvider.location : undefined,
      notes: newAppointment.notes,
      status: 'scheduled'
    };

    setAppointments(prev => [...prev, appointment]);
    dispatch({ type: 'ADD_XP', payload: 30 });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: `✅ Appointment scheduled with ${selectedProvider.name} for ${appointment.date} at ${appointment.time}` 
    });

    // Reset form
    setShowNewAppointment(false);
    setSelectedProvider(null);
    setNewAppointment({
      type: 'therapy',
      format: 'video',
      duration: 60
    });
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(apt => apt.status === 'scheduled' && new Date(apt.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getAppointmentIcon = (type: string) => {
    return appointmentTypes.find(t => t.id === type)?.icon || User;
  };

  const getAppointmentColor = (type: string) => {
    return appointmentTypes.find(t => t.id === type)?.color || 'blue';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} flex items-center gap-3`}>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary}`}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Appointment Scheduler
            </h2>
            <p className={`${theme.textSecondary} mt-2`}>
              Schedule and manage your mental health appointments
            </p>
          </div>
          
          <button
            onClick={() => setShowNewAppointment(true)}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r ${theme.primary} text-white font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Upcoming', value: getUpcomingAppointments().length, icon: Calendar },
            { label: 'This Month', value: appointments.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length, icon: Clock },
            { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: CheckCircle },
            { label: 'Providers', value: new Set(appointments.map(a => a.provider)).size, icon: User }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-sm ${theme.textSecondary}`}>{stat.label}</p>
                  <p className={`text-xl font-bold ${theme.text}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${theme.text}`}>Schedule New Appointment</h3>
            <button
              onClick={() => setShowNewAppointment(false)}
              className="p-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Appointment Type */}
            <div>
              <label className={`block text-sm font-medium ${theme.text} mb-3`}>
                Appointment Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {appointmentTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setNewAppointment(prev => ({ ...prev, type: type.id as any }))}
                    className={`p-3 rounded-xl text-left transition-all duration-200 ${
                      newAppointment.type === type.id
                        ? `bg-gradient-to-r ${theme.primary} text-white`
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className={`block text-sm font-medium ${theme.text} mb-3`}>
                Select Provider
              </label>
              <div className="space-y-3">
                {providers
                  .filter(p => p.type === newAppointment.type)
                  .map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                        selectedProvider?.id === provider.id
                          ? `bg-gradient-to-r ${theme.primary} text-white`
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{provider.name}</h4>
                          <p className={`text-sm ${selectedProvider?.id === provider.id ? 'text-white/80' : theme.textSecondary}`}>
                            {provider.specialty}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs">⭐ {provider.rating}</span>
                            <span className="text-xs">
                              Available: {provider.availability.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {selectedProvider && (
              <>
                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Time
                    </label>
                    <input
                      type="time"
                      value={newAppointment.time || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-3`}>
                    Session Format
                  </label>
                  <div className="flex gap-3">
                    {formatOptions
                      .filter(format => selectedProvider.format.includes(format.id as any))
                      .map(format => (
                        <button
                          key={format.id}
                          onClick={() => setNewAppointment(prev => ({ ...prev, format: format.id as any }))}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                            newAppointment.format === format.id
                              ? `bg-gradient-to-r ${theme.primary} text-white`
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                        >
                          <format.icon className="w-4 h-4" />
                          <span className="text-sm">{format.name}</span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Duration (minutes)
                  </label>
                  <select
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newAppointment.notes || ''}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any specific topics or concerns you'd like to discuss..."
                    className="w-full h-24 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Schedule Button */}
                <button
                  onClick={handleScheduleAppointment}
                  disabled={!newAppointment.date || !newAppointment.time}
                  className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 ${
                    newAppointment.date && newAppointment.time
                      ? `bg-gradient-to-r ${theme.primary} text-white hover:shadow-lg`
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Schedule Appointment & Earn 30 XP
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Upcoming Appointments */}
      {getUpcomingAppointments().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
            <Clock className="w-5 h-5" />
            Upcoming Appointments
          </h3>
          
          <div className="space-y-4">
            {getUpcomingAppointments().slice(0, 5).map((appointment) => {
              const IconComponent = getAppointmentIcon(appointment.type);
              const color = getAppointmentColor(appointment.type);
              
              return (
                <div key={appointment.id} className="p-4 bg-white/30 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-${color}-100`}>
                        <IconComponent className={`w-4 h-4 text-${color}-600`} />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme.text}`}>{appointment.provider}</h4>
                        <p className={`text-sm ${theme.textSecondary} mb-1`}>
                          {appointmentTypes.find(t => t.id === appointment.type)?.name}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>📅 {new Date(appointment.date).toLocaleDateString()}</span>
                          <span>🕐 {appointment.time}</span>
                          <span>⏱️ {appointment.duration} min</span>
                          <span className="capitalize">
                            {appointment.format === 'video' && '📹'}
                            {appointment.format === 'phone' && '📞'}
                            {appointment.format === 'in_person' && '📍'}
                            {appointment.format.replace('_', ' ')}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className={`text-xs ${theme.textSecondary} mt-2 italic`}>
                            "{appointment.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-1 rounded hover:bg-white/30 transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 rounded hover:bg-white/30 transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Provider Directory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
          <User className="w-5 h-5" />
          Provider Directory
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div key={provider.id} className="p-4 bg-white/30 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-semibold ${theme.text}`}>{provider.name}</h4>
                <div className="flex items-center gap-1 text-xs bg-yellow-100 px-2 py-1 rounded-full">
                  ⭐ {provider.rating}
                </div>
              </div>
              
              <p className={`text-sm ${theme.textSecondary} mb-2`}>{provider.specialty}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  provider.type === 'therapy' ? 'bg-blue-100 text-blue-800' :
                  provider.type === 'psychiatrist' ? 'bg-purple-100 text-purple-800' :
                  provider.type === 'counselor' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {provider.type.replace('_', ' ')}
                </span>
              </div>
              
              <div className="text-xs text-gray-600">
                <p>📅 Available: {provider.availability.join(', ')}</p>
                {provider.location && <p>📍 {provider.location}</p>}
                <p>💻 Formats: {provider.format.join(', ').replace(/_/g, ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}