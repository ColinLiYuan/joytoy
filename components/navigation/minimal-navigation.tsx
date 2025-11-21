// components/navigation/minimal-header.tsx
'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function MinimalHeader() {
    return (
        <header className="minimal-header">
            <div className="container">
                <div className="minimal-header-content">
                    <Link href="/" className="logo">
                        <FontAwesomeIcon icon={faHome} />
                        MythToy
                    </Link>
                </div>
            </div>
        </header>
    );
}