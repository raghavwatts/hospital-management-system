import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="error-page">
    <div className="error-code">403</div>
    <h2>Access Denied</h2>
    <p>You don't have permission to view this page.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default Unauthorized;
