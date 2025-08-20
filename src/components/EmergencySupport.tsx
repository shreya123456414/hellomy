import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  Clock,
  MapPin,
  Users,
  Headphones
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';

interface CrisisResource {
  name: string;
  phone: string;
  text?: string;
  website?: string;
  description: string;
  availability: string;
  type: 'crisis' | 'support' | 'therapy' | 'emergency';
}

export default function EmergencySupport() {
  const { state } = useApp();
  const theme = themes[state.currentTheme];
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [resourceType, setResourceType] = useState<'all' | 'crisis' | 'support' | 'therapy'>('all');

  const crisisResources: Record<string, CrisisResource[]> = {
    US: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        text: 'Text 988',
        website: 'https://988lifeline.org',
        description: 'Free and confidential emotional support 24/7',
        availability: '24/7',
        type: 'crisis'
      },
      {
        name: 'Crisis Text Line',
        phone: '',
        text: 'Text HOME to 741741',
        website: 'https://crisistextline.org',
        description: 'Free crisis support via text message',
        availability: '24/7',
        type: 'crisis'
      },
      {
        name: 'NAMI Helpline',
        phone: '1-800-950-6264',
        website: 'https://nami.org',
        description: 'Mental health information and support',
        availability: 'Mon-Fri 10am-10pm ET',
        type: 'support'
      },
      {
        name: 'SAMHSA Helpline',
        phone: '1-800-662-4357',
        website: 'https://samhsa.gov',
        description: 'Treatment referral and information service',
        availability: '24/7',
        type: 'therapy'
      },
      {
        name: 'Emergency Services',
        phone: '911',
        description: 'Immediate emergency medical assistance',
        availability: '24/7',
        type: 'emergency'
      }
    ],
    UK: [
      {
        name: 'Samaritans',
        phone: '116 123',
        website: 'https://samaritans.org',
        description: 'Free emotional support for anyone in distress',
        availability: '24/7',
        type: 'crisis'
      },
      {
        name: 'Mind Infoline',
        phone: '0300 123 3393',
        website: 'https://mind.org.uk',
        description: 'Mental health information and support',
        availability: 'Mon-Fri 9am-6pm',
        type: 'support'
      },
      {
        name: 'NHS 111',
        phone: '111',
        website: 'https://nhs.uk',
        description: 'Non-emergency medical advice',
        availability: '24/7',
        type: 'therapy'
      },
      {
        name: 'Emergency Services',
        phone: '999',
        description: 'Immediate emergency assistance',
        availability: '24/7',
        type: 'emergency'
      }
    ],
    CA: [
      {
        name: 'Talk Suicide Canada',
        phone: '1-833-456-4566',
        text: 'Text 45645',
        website: 'https://talksuicide.ca',
        description: 'National suicide prevention service',
        availability: '24/7',
        type: 'crisis'
      },
      {
        name: 'Kids Help Phone',
        phone: '1-800-668-6868',
        text: 'Text CONNECT to 686868',
        website: 'https://kidshelpphone.ca',
        description: 'Support for young people',
        availability: '24/7',
        type: 'support'
      },
      {
        name: 'Emergency Services',
        phone: '911',
        description: 'Immediate emergency assistance',
        availability: '24/7',
        type: 'emergency'
      }
    ]
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' }
  ];

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: Heart },
    { id: 'crisis', name: 'Crisis Support', icon: AlertTriangle },
    { id: 'support', name: 'General Support', icon: Users },
    { id: 'therapy', name: 'Professional Help', icon: Headphones }
  ];

  const filteredResources = crisisResources[selectedCountry]?.filter(resource => 
    resourceType === 'all' || resource.type === resourceType
  ) || [];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'crisis': return AlertTriangle;
      case 'support': return Users;
      case 'therapy': return Headphones;
      case 'emergency': return Phone;
      default: return Heart;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'crisis': return 'red';
      case 'support': return 'blue';
      case 'therapy': return 'green';
      case 'emergency': return 'orange';
      default: return 'purple';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className={`text-2xl font-bold ${theme.text}`}>Emergency Support</h2>
          <p className={`${theme.textSecondary} mt-2`}>
            Immediate access to crisis support and mental health resources
          </p>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">If you're in immediate danger</h3>
              <p className="text-sm text-red-700 mb-2">
                Please call emergency services immediately or go to your nearest emergency room.
              </p>
              <div className="flex gap-2">
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call 911 (US)
                </a>
                <a
                  href="tel:988"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call 988
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              <MapPin className="w-4 h-4 inline mr-1" />
              Country/Region
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Resource Type
            </label>
            <div className="flex gap-2 overflow-x-auto">
              {resourceTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setResourceType(type.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                    resourceType === type.id
                      ? `bg-gradient-to-r ${theme.primary} text-white`
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crisis Resources */}
      <div className="grid gap-4">
        {filteredResources.map((resource, index) => {
          const IconComponent = getResourceIcon(resource.type);
          const color = getResourceColor(resource.type);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${theme.surface} border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-${color}-100 flex-shrink-0`}>
                  <IconComponent className={`w-6 h-6 text-${color}-600`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${theme.text}`}>{resource.name}</h3>
                    <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {resource.availability}
                    </div>
                  </div>
                  
                  <p className={`text-sm ${theme.textSecondary} mb-4`}>
                    {resource.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-${color}-500 to-${color}-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200`}
                      >
                        <Phone className="w-4 h-4" />
                        Call {resource.phone}
                      </a>
                    )}
                    
                    {resource.text && (
                      <a
                        href={`sms:${resource.text.includes('to') ? resource.text.split('to ')[1] : resource.text}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/50 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {resource.text}
                      </a>
                    )}
                    
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 hover:bg-white/50 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Self-Care Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
          <Heart className="w-5 h-5" />
          Immediate Self-Care Steps
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Ground Yourself</h4>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">2</span>
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Breathe Deeply</h4>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Take slow, deep breaths. Inhale for 4, hold for 4, exhale for 6
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Reach Out</h4>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Contact a trusted friend, family member, or use the resources above
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-orange-600">4</span>
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Stay Safe</h4>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Remove yourself from immediate danger and seek professional help
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex flex-col gap-2">
          <a
            href="tel:988"
            className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
            title="Call 988 Crisis Lifeline"
          >
            <Phone className="w-6 h-6" />
          </a>
          <a
            href="sms:741741"
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
            title="Text Crisis Line"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}