// components/client-age-verification.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientAgeVerification() {
    const [isAgeVerified, setIsAgeVerified] = useState(true); // 默认true，服务端渲染完整内容
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 客户端检查年龄验证状态
        try {
            const ageVerified = localStorage.getItem('ageVerified') === 'true';
            setIsAgeVerified(ageVerified);
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            setIsAgeVerified(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // 控制页面滚动
        if (!isAgeVerified && !isLoading) {
            document.body.style.overflow = 'hidden';
            document.getElementById('main-content')?.style.setProperty('filter', 'blur(5px)', 'important');
        } else {
            document.body.style.overflow = 'auto';
            document.getElementById('main-content')?.style.setProperty('filter', 'none', 'important');
        }
    }, [isAgeVerified, isLoading]);

    const handleEnter = () => {
        try {
            localStorage.setItem('ageVerified', 'true');
        } catch (e) {
            console.error('Error setting localStorage:', e);
        }
        setIsAgeVerified(true);
    };

    const handleExit = () => {
        window.location.href = 'https://www.google.com';
    };

    if (isLoading || isAgeVerified) {
        return null;
    }

    return (
        <div id="age-verification" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="age-modal" style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                <h2>Age Verification Required</h2>
                <p>This website contains adult content and is intended for individuals 18 years of age or older. By
                    entering, you confirm that you are at least 18 years old and agree to our Terms of Service and
                    Privacy Policy.</p>
                <div className="age-buttons" style={{ marginTop: '1.5rem' }}>
                    <button
                        onClick={handleEnter}
                        style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            margin: '0 10px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        I am 18 or older
                    </button>
                    <button
                        onClick={handleExit}
                        style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            margin: '0 10px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
}