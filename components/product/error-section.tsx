// /components/error-section.tsx
'use client';

export default function ErrorSection() {
    return (
        <div className="error-section">
            <div className="no-products">
                <div className="no-products-icon">⚠️</div>
                <h3>Error loading page</h3>
                <p>Failed to load products and categories</p>
                <button
                    onClick={() => window.location.reload()}
                    className="back-to-all-btn"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}