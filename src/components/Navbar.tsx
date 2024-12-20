import { Link } from "react-router-dom";

const Navbar: React.FC = () => (
  <nav className="bg-blue-600 p-4 text-white">
    <div className="flex justify-between max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Scheduling App</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
