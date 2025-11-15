import { categoryServiceServer } from '@/services/servers/category-service-server';
import { RootResponse } from '@/types/category';
import Notice from '@/components/common/notice';
import Navigation from '@/components/navigation/navigation';
import Footer from '@/components/footer';

export default async function PagesLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    let rootsData: RootResponse[] = [];
    try {
        const roots = await categoryServiceServer.getRoots();
        rootsData = Array.isArray(roots) ? roots : [];
    } catch (error) {
        console.error('Failed to load categories:', error);
        rootsData = [];
    }

    return (
        <div>
            <Navigation rootsData={rootsData} />
            <Notice />
            {children}
            <Footer />
        </div>
    );
}