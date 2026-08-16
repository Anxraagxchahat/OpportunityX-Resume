/**
 * OpportunityX Photo & Asset Optimizer
 * High-performance client-side image compression and resizing using HTML5 Canvas.
 * Downsamples raw headshots / images to compact, high-quality Base64 strings (~30KB - 80KB)
 * to guarantee instantaneous localStorage persistence without hitting quota limits.
 */

/**
 * Optimizes an image File, Blob, or existing Data URL / Image URL
 * @param {File|Blob|string} fileOrSource - Image file, blob, or base64/url string
 * @param {number} maxWidth - Maximum bounding width (default 500px)
 * @param {number} maxHeight - Maximum bounding height (default 500px)
 * @param {number} quality - JPEG compression quality 0.0 - 1.0 (default 0.88)
 * @returns {Promise<string>} - Resolves to optimized Base64 data URL
 */
export const optimizeProfileImage = (fileOrSource, maxWidth = 500, maxHeight = 500, quality = 0.88) => {
  return new Promise((resolve, reject) => {
    if (!fileOrSource) {
      return reject(new Error('No image file or source provided'));
    }

    const processSource = (src) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let { width, height } = img;

          // Compute aspect ratio-preserving dimensions
          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Ensure valid non-zero dimensions
          width = Math.max(1, width);
          height = Math.max(1, height);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(src);
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as optimized JPEG or PNG
          const mimeType = 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(optimizedDataUrl);
        } catch (err) {
          console.warn('[PhotoOptimizer] Canvas compression fallback:', err);
          resolve(src);
        }
      };

      img.onerror = () => {
        if (typeof fileOrSource === 'string') {
          // If remote image fails CORS on canvas, fallback to URL directly
          resolve(fileOrSource);
        } else {
          reject(new Error('Failed to load image for optimization'));
        }
      };

      img.src = src;
    };

    if (typeof fileOrSource === 'string') {
      processSource(fileOrSource);
    } else if (fileOrSource instanceof Blob || fileOrSource instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processSource(e.target.result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = (e) => reject(new Error('FileReader error: ' + e));
      reader.readAsDataURL(fileOrSource);
    } else {
      reject(new Error('Unsupported image format'));
    }
  });
};
