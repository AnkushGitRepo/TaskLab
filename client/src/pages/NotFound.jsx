import { Link } from 'react-router-dom';

/**
 * @page NotFound
 * @desc  404 page matching design system
 */
const NotFound = () => (
  <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-6">
    <div className="text-8xl font-bold text-gradient-primary mb-4">404</div>
    <h1 className="text-h2 font-bold text-on-surface mb-4">Page not found</h1>
    <p className="text-on-surface-variant text-lg mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/dashboard" className="btn-primary">
      ← Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
