// /app/api/admin/product/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-utils';
import { BACKEND_CONFIG } from '@/lib/api-config';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;
        const slug = formData.get('slug') as string;
        const fileName = formData.get('fileName') as string;
        const index = formData.get('index') as string;

        console.log('上传参数:', {
            type,
            slug,
            fileName,
            index,
            fileSize: file?.size,
            fileType: file?.type
        });

        // 验证必填参数
        if (!file || !type || !slug || !fileName) {
            return NextResponse.json(
                { success: false, error: '缺少必要参数: file, type, slug, fileName' },
                { status: 400 }
            );
        }

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, error: '只能上传图片文件' },
                { status: 400 }
            );
        }

        // 直接调用后端上传接口
        const backendUrl = `${BACKEND_CONFIG.baseURL}/api/admin/V1/product/upload/image`;

        console.log('调用后端上传接口:', backendUrl);

        // 创建新的 FormData
        const backendFormData = new FormData();
        backendFormData.append('file', file, fileName); // 使用生成的文件名
        backendFormData.append('type', type);
        backendFormData.append('slug', slug);
        backendFormData.append('fileName', fileName);
        if (index) {
            backendFormData.append('index', index);
        }

        console.log('FormData 字段:', {
            hasFile: backendFormData.has('file'),
            hasType: backendFormData.has('type'),
            hasSlug: backendFormData.has('slug'),
            hasFileName: backendFormData.has('fileName'),
            hasIndex: backendFormData.has('index')
        });

        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
            headers: {
                ...(BACKEND_CONFIG.defaultHeaders['Authorization'] && {
                    'Authorization': BACKEND_CONFIG.defaultHeaders['Authorization']
                }),
                ...(BACKEND_CONFIG.defaultHeaders['Cookie'] && {
                    'Cookie': BACKEND_CONFIG.defaultHeaders['Cookie']
                })
            },
        });

        console.log('后端响应状态:', backendResponse.status);

        if (!backendResponse.ok) {
            let errorDetail = '';
            try {
                const errorData = await backendResponse.json();
                errorDetail = JSON.stringify(errorData);
            } catch {
                try {
                    errorDetail = await backendResponse.text();
                } catch {
                    errorDetail = backendResponse.statusText;
                }
            }

            console.error('后端上传失败详情:', {
                status: backendResponse.status,
                detail: errorDetail
            });

            throw new Error(`后端上传失败: ${backendResponse.status} - ${errorDetail}`);
        }

        const backendResult = await backendResponse.json();
        console.log('后端上传成功:', backendResult);

        return NextResponse.json({
            success: true,
            data: {
                url: backendResult.url || backendResult.data?.url || fileName, // 使用文件名作为URL
                fileName: backendResult.fileName || backendResult.data?.fileName || fileName,
                originalName: file.name,
                size: file.size,
                finalSlug: slug
            }
        });

    } catch (error) {
        console.error('图片上传失败:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}