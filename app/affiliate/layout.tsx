import AffiliateLayoutClient from './affiliate-layout-client'

export const dynamic = 'force-dynamic';

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
    return <AffiliateLayoutClient>{children}</AffiliateLayoutClient>
}
