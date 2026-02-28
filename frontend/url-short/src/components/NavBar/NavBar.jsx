import './NavBar.css'

export default function NavBar({ activeView, onViewChange }) {
    return (
    <nav className="navbar">
        <div className="navbar-container">
            <h1 className="navbar-brand">URL Shortener</h1>
            <div className="navbar-links">
            <button 
                onClick={() => onViewChange('create')}
                className={`nav-link ${activeView === 'create' ? 'active' : ''}`}
            >
                Shorten URL
            </button>
            <button 
                onClick={() => onViewChange('list')}
                className={`nav-link ${activeView === 'list' ? 'active' : ''}`}
            >
                List URLs
            </button>
            <a 
                href="http://localhost:8000/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link docs-link"
            >
                API Docs
            </a>
            </div>
        </div>
    </nav>
    )
}
