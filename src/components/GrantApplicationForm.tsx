import { useState } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle, Heart, Building2, User, Mail, Phone, Globe, DollarSign } from 'lucide-react';

interface GrantApplicationFormProps {
  onSubmit: (application: GrantApplication) => Promise<void>;
  onClose: () => void;
}

export interface GrantApplication {
  applicationType: 'research' | 'family_support' | 'equipment';
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  taxId: string;
  amountRequested: number;
  projectTitle: string;
  projectDescription: string;
  objectives: string;
  timeline: string;
  budget: string;
  impact: string;
  previousFunding: string;
  documents: File[];
}

export default function GrantApplicationForm({ onSubmit, onClose }: GrantApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<Partial<GrantApplication>>({
    applicationType: 'research',
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    country: '',
    taxId: '',
    amountRequested: 0,
    projectTitle: '',
    projectDescription: '',
    objectives: '',
    timeline: '',
    budget: '',
    impact: '',
    previousFunding: '',
    documents: []
  });

  const applicationTypes = [
    {
      id: 'research',
      name: 'Research Grant',
      description: 'Funding for clinical research, trials, and studies',
      icon: '🔬',
      maxAmount: 250000
    },
    {
      id: 'family_support',
      name: 'Family Support',
      description: 'Travel, housing, and care assistance for families',
      icon: '👨‍👩‍👧',
      maxAmount: 50000
    },
    {
      id: 'equipment',
      name: 'Equipment Grant',
      description: 'Medical equipment and lab instruments',
      icon: '⚕️',
      maxAmount: 100000
    }
  ];

  const selectedType = applicationTypes.find(t => t.id === formData.applicationType);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData as GrantApplication);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-owl-navy via-owl-slate to-black border-2 border-pink-700 rounded-2xl max-w-4xl w-full my-8 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
        <div className="sticky top-0 bg-gradient-to-r from-pink-900/50 to-red-900/50 backdrop-blur-glass border-b border-pink-700 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart size={28} className="text-pink-400" />
                Foundation Grant Application
              </h2>
              <p className="text-sm text-gray-400">Step {step} of 4</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-pink-400 transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">Application Submitted!</h3>
            <p className="text-gray-300 mb-6">
              Thank you for applying. Our team will review your application and respond within 10 business days.
            </p>
            <div className="bg-owl-slate/50 rounded-xl p-6 border border-pink-800 inline-block text-left">
              <div className="text-sm text-gray-400 mb-4">What happens next?</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center font-bold">1</div>
                  <span>Initial review (5 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center font-bold">2</div>
                  <span>Scientific advisory evaluation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center font-bold">3</div>
                  <span>Board decision</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center font-bold">4</div>
                  <span>Notification & funding</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-800 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] rounded-xl font-bold transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Select Grant Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {applicationTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => updateField('applicationType', type.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.applicationType === type.id
                          ? 'border-pink-500 bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                          : 'border-gray-700 hover:border-pink-700'
                      }`}
                    >
                      <div className="text-5xl mb-3">{type.icon}</div>
                      <div className="font-bold text-lg mb-2">{type.name}</div>
                      <div className="text-sm text-gray-400 mb-3">{type.description}</div>
                      <div className="text-xs text-pink-400 font-semibold">
                        Max: ${type.maxAmount.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-800 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] rounded-xl font-bold transition-all"
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Organization Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Building2 size={16} />
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => updateField('organizationName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <User size={16} />
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => updateField('contactName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Mail size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Phone size={16} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Globe size={16} />
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <FileText size={16} />
                      Tax ID / EIN *
                    </label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateField('taxId', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.organizationName || !formData.contactName || !formData.email}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-pink-800 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Project Details</h3>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign size={16} />
                    Amount Requested (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.amountRequested}
                    onChange={(e) => updateField('amountRequested', parseInt(e.target.value))}
                    max={selectedType?.maxAmount}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Maximum: ${selectedType?.maxAmount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project Title *</label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => updateField('projectTitle', e.target.value)}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project Description *</label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => updateField('projectDescription', e.target.value)}
                    rows={6}
                    maxLength={5000}
                    placeholder="Describe your project, its goals, and expected outcomes..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.projectDescription?.length || 0}/5000
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!formData.amountRequested || !formData.projectTitle || !formData.projectDescription}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-pink-800 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Review & Submit</h3>

                <div className="bg-owl-slate/50 rounded-xl p-6 border border-pink-800 space-y-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Grant Type</div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{selectedType?.icon}</span>
                      <span className="font-bold text-lg">{selectedType?.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Organization</div>
                      <div className="font-semibold">{formData.organizationName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Contact</div>
                      <div className="font-semibold">{formData.contactName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Email</div>
                      <div className="font-semibold text-sm">{formData.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Amount Requested</div>
                      <div className="font-bold text-pink-400 text-lg">
                        ${formData.amountRequested?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Project Title</div>
                    <div className="font-semibold">{formData.projectTitle}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Description</div>
                    <div className="text-sm text-gray-300 max-h-32 overflow-y-auto">
                      {formData.projectDescription}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    By submitting this application, you certify that all information provided is accurate
                    and that your organization is a registered non-profit or qualified medical institution.
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-all"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-pink-800 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
