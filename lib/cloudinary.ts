import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Folder name in Cloudinary (e.g., 'registrations', 'calon-murid')
 * @param options - Additional upload options
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string = 'iqrolife',
  options: {
    public_id?: string;
    transformation?: any;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    const uploadOptions = {
      folder: `iqrolife/${folder}`,
      resource_type: options.resource_type || 'auto',
      ...options,
    };

    // Convert buffer to base64 if needed
    const fileToUpload = Buffer.isBuffer(file)
      ? `data:image/png;base64,${file.toString('base64')}`
      : file;

    const result = await cloudinary.uploader.upload(
      fileToUpload,
      uploadOptions
    );

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - The public_id of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - The public_id of the image
 * @param transformations - Transformation options
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        quality: transformations.quality || 'auto',
        fetch_format: transformations.format || 'auto',
        ...transformations,
      },
    ],
  });
}

export default cloudinary;
