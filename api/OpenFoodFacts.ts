import { userAgent } from '../config/OFFAuth';

export interface ProductUploadArgs {
  ean: string;
  name: string;
  brand: string;
  labels: string;
  categories: string;
  category: 'Food' | 'Beauty';
  wholePicture?: string;
  ingredientsPicture?: string;
  nutritionPicture?: string;
}

export interface OpenFoodFactsProduct {
  status: number;
  product?: {
    product_name: string;
    brands: string;
    labels: string;
    categories: string;
    code: string;
    image_front_url?: string;
    nutrition_grade_fr?: string;
    ingredients_text?: string;
    // Add more fields as needed
  };
}

function _getBaseUrl(category: string): string {
  return category === 'Food' ? 'https://world.openfoodfacts.org' : 'https://world.openbeautyfacts.org';
}

export async function getProduct(ean: string, category: string): Promise<OpenFoodFactsProduct | null> {
  const url = `${_getBaseUrl(category)}/api/v0/product/${ean}.json`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      }
    });
    const product = await response.json();
    if (product.status === 0) {
      return null;
    }
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function uploadProductToOFF(args: ProductUploadArgs): Promise<void> {
  const { getEditComment, userId, password } = await import('../config/OFFAuth');
  
  const comment = await getEditComment();
  const url = `${_getBaseUrl(args.category)}/cgi/product_jqm2.pl?code=${args.ean}&product_name=${encodeURIComponent(
    args.name
  )}&add_brands=${encodeURIComponent(args.brand)}&add_labels=${encodeURIComponent(
    args.labels
  )}&add_categories=${encodeURIComponent(args.categories)}&comment=${encodeURIComponent(
    comment
  )}&user_id=${userId}&password=${encodeURIComponent(password)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      }
    });
    
    const responseText = await response.text();
    console.log('=> OFF response text:', responseText.substring(0, 100));
    
    if (args.wholePicture) {
      await _addPictureToProduct(
        args.category,
        args.ean,
        args.wholePicture,
        'front',
        'imgupload_front',
        'front_img.jpg'
      );
    }
    if (args.ingredientsPicture) {
      await _addPictureToProduct(
        args.category,
        args.ean,
        args.ingredientsPicture,
        'ingredients',
        'imgupload_ingredients',
        'ingredient_img.jpg'
      );
    }
    if (args.nutritionPicture) {
      await _addPictureToProduct(
        args.category,
        args.ean,
        args.nutritionPicture,
        'nutrition',
        'imgupload_nutrition',
        'nutrition_img.jpg'
      );
    }
  } catch (error) {
    console.error('Error uploading product:', error);
    throw error;
  }
}

async function _addPictureToProduct(
  category: string,
  code: string,
  picture: string,
  fieldValue: string,
  imgUpload: string,
  imgTitle: string
): Promise<void> {
  const { userId, password } = await import('../config/OFFAuth');
  const url = `${_getBaseUrl(category)}/cgi/product_image_upload.pl`;

  const formData = new FormData();
  formData.append('code', code);
  formData.append('imagefield', fieldValue);
  formData.append(imgUpload, {
    uri: picture,
    type: 'image/jpg',
    name: imgTitle
  } as any);
  formData.append('user_id', userId);
  formData.append('password', password);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'User-Agent': userAgent
      },
      body: formData
    });
    
    const responseText = await response.text();
    console.log('uploaded picture: got response text: ', responseText);
  } catch (error) {
    console.error('Error uploading picture:', error);
    throw error;
  }
}
