'use client'; // 因为使用了 usePathname，需要标记为客户端组件

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './header.css'

export default function Navigation() {
    const pathname = usePathname();

    return (
        <header>
            <div className="container">
                <nav className="header-content">
                    <a href="#" className="logo">
                        <i className="fas fa-home"></i>
                        Ball
                    </a>

                    <ul className="nav-menu">
                        <li className="nav-item"><Link href="/home" className="nav-link"><p>Home</p></Link></li>
                        <li className="nav-item"><Link href="/products" className="nav-link"><p>Products</p></Link></li>
                        <li className="nav-item"><Link href="/about" className="nav-link"><p>About</p></Link></li>
                        <li className="nav-item"><Link href="/contact" className="nav-link"><p>Contact</p></Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}