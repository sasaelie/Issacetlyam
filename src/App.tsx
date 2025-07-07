import React from 'react';
import { AppProvider } from './store/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import References from './components/References';
import News from './components/News';
import BookingCalendar from './components/BookingCalendar';
import ContactForm from './components/ContactForm';
import PDFShare from './components/PDFShare';
import Footer from './components/Footer';
import './styles/variables.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <main className="min-h-screen">
          <Hero />
          <About />
          <Services />
          <Testimonials />
          <References />
          <News />
          <BookingCalendar />
          <ContactForm />
          <PDFShare />
          <Footer />
        </main>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;