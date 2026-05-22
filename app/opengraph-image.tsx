import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MythToy - Premium Adult Lifestyle Products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
                    fontFamily: 'Georgia, serif',
                    padding: 80,
                }}
            >
                {/* Gold accent line */}
                <div
                    style={{
                        width: 80,
                        height: 2,
                        backgroundColor: '#C5A059',
                        marginBottom: 40,
                    }}
                />
                {/* Brand name */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        letterSpacing: '0.05em',
                        marginBottom: 16,
                        fontFamily: 'Georgia, serif',
                    }}
                >
                    MYTHTOY
                </div>
                {/* Tagline */}
                <div
                    style={{
                        fontSize: 28,
                        color: '#C5A059',
                        letterSpacing: '0.15em',
                        marginBottom: 48,
                        fontFamily: 'Georgia, serif',
                        fontStyle: 'italic',
                    }}
                >
                    Premium Adult Lifestyle
                </div>
                {/* Divider */}
                <div
                    style={{
                        width: 200,
                        height: 1,
                        backgroundColor: 'rgba(197, 160, 89, 0.3)',
                        marginBottom: 40,
                    }}
                />
                {/* Description */}
                <div
                    style={{
                        fontSize: 20,
                        color: 'rgba(255, 255, 255, 0.6)',
                        maxWidth: 700,
                        textAlign: 'center',
                        lineHeight: 1.6,
                        fontFamily: 'Georgia, serif',
                    }}
                >
                    Body-safe devices for wellness & intimacy.
                    Elegant design meets cutting-edge technology.
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
