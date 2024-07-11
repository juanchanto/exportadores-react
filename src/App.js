import './App.css';
import ExporterForm from './ExporterForm';

function App() {
  return (
    <div className="App">
      <ExporterForm />
          {/* Footer con información personal */}
          <footer className="mt-4 p-3 text-center bg-light">
                <p>Desarrollado por Juan Chanto A - juanchanto96@gmail.com</p>
                <p>Único propósito de prueba técnica</p>
            </footer>
    </div>
  );
}

export default App;