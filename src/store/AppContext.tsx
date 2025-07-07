import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  eventType: string;
}

interface AppState {
  // Form state
  contactForm: ContactForm;
  
  // UI state
  isFormSubmitting: boolean;
  formSubmitted: boolean;
  
  // Calendar state
  selectedDate: string | null;
  
  // Testimonials state
  showTestimonialForm: boolean;
}

interface AppContextType {
  state: AppState;
  updateContactForm: (field: keyof ContactForm, value: string) => void;
  setFormSubmitting: (isSubmitting: boolean) => void;
  setFormSubmitted: (submitted: boolean) => void;
  setSelectedDate: (date: string | null) => void;
  toggleTestimonialForm: () => void;
  resetForm: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  contactForm: {
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
    eventType: ''
  },
  isFormSubmitting: false,
  formSubmitted: false,
  selectedDate: null,
  showTestimonialForm: false
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateContactForm = (field: keyof ContactForm, value: string) => {
    setState(prev => ({
      ...prev,
      contactForm: { ...prev.contactForm, [field]: value }
    }));
  };

  const setFormSubmitting = (isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isFormSubmitting: isSubmitting }));
  };

  const setFormSubmitted = (submitted: boolean) => {
    setState(prev => ({ ...prev, formSubmitted: submitted }));
  };

  const setSelectedDate = (date: string | null) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      contactForm: { ...prev.contactForm, date: date || '' }
    }));
  };

  const toggleTestimonialForm = () => {
    setState(prev => ({
      ...prev,
      showTestimonialForm: !prev.showTestimonialForm
    }));
  };

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      contactForm: initialState.contactForm,
      formSubmitted: false,
      selectedDate: null
    }));
  };

  const contextValue: AppContextType = {
    state,
    updateContactForm,
    setFormSubmitting,
    setFormSubmitted,
    setSelectedDate,
    toggleTestimonialForm,
    resetForm
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};