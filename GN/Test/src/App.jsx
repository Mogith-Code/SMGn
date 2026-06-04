import About from './Components/About';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Navbar from './components/Navbar';
import Services from './Components/Services';



function App() {
  return (
     <>
      <Navbar />
      <main>
        <Home />
        <About />
        <Services />
      </main>
     <Footer />
        {/* About section will go here */}
        {/* Services section will go here */}
    </>
  );
}

export default App;
