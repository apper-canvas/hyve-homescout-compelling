import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Browse from "@/components/pages/Browse";
import PropertyDetail from "@/components/pages/PropertyDetail";
import MapView from "@/components/pages/MapView";
import SavedProperties from "@/components/pages/SavedProperties";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <Layout>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/saved" element={<SavedProperties />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;