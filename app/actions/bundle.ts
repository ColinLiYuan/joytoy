'use server'

import { uploadProductImage } from '@/app/actions/product'

// 套装直接使用产品的图片上传接口
export const uploadBundleImage = uploadProductImage
