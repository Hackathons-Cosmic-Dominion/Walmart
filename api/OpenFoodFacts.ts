import { userAgent } from '../config/OFFAuth';
import { productCache } from '../services/ProductCache';

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

// Comprehensive interface based on the Open Food Facts API response
export interface OpenFoodFactsProduct {
  code: string;
  status: number;
  status_verbose: string;
  product?: {
    _id: string;
    _keywords: string[];
    code: string;
    
    // Basic product info
    product_name: string;
    product_name_en?: string;
    product_name_fr?: string;
    product_name_de?: string;
    product_name_it?: string;
    product_name_nl?: string;
    product_name_ar?: string;
    product_name_ro?: string;
    
    // Generic name
    generic_name?: string;
    generic_name_en?: string;
    generic_name_fr?: string;
    generic_name_de?: string;
    generic_name_it?: string;
    generic_name_nl?: string;
    
    // Brand and category info
    brands: string;
    brands_tags: string[];
    categories: string;
    categories_tags: string[];
    categories_hierarchy: string[];
    
    // Labels (organic, gluten-free, etc.)
    labels: string;
    labels_tags: string[];
    labels_hierarchy: string[];
    
    // Origins and manufacturing
    origins?: string;
    origins_tags: string[];
    origins_hierarchy: string[];
    manufacturing_places?: string;
    manufacturing_places_tags: string[];
    
    // Countries where sold
    countries: string;
    countries_tags: string[];
    countries_hierarchy: string[];
    
    // Stores
    stores?: string;
    stores_tags: string[];
    
    // Purchase places
    purchase_places?: string;
    purchase_places_tags: string[];
    
    // Quantity and packaging
    quantity?: string;
    product_quantity?: string;
    product_quantity_unit?: string;
    serving_size?: string;
    serving_quantity?: string;
    serving_quantity_unit?: string;
    
    // Packaging info
    packaging?: string;
    packaging_tags: string[];
    packaging_hierarchy: string[];
    packaging_text?: string;
    packaging_text_en?: string;
    packaging_text_fr?: string;
    packagings?: Array<{
      material?: string;
      shape?: string;
      recycling?: string;
      number_of_units?: number;
      quantity_per_unit?: string;
      quantity_per_unit_value?: number;
      quantity_per_unit_unit?: string;
      weight_measured?: number;
    }>;
    
    // Ingredients
    ingredients_text: string;
    ingredients_text_en?: string;
    ingredients_text_fr?: string;
    ingredients_text_de?: string;
    ingredients_text_it?: string;
    ingredients_text_nl?: string;
    ingredients_text_ar?: string;
    ingredients?: Array<{
      id: string;
      text: string;
      percent_estimate?: number;
      percent_min?: number;
      percent_max?: number;
      vegan?: string;
      vegetarian?: string;
    }>;
    ingredients_n?: number;
    ingredients_analysis_tags: string[];
    
    // Allergens
    allergens?: string;
    allergens_tags: string[];
    allergens_hierarchy: string[];
    traces?: string;
    traces_tags: string[];
    
    // Nutrition info
    nutrition_data?: string;
    nutrition_data_per?: string;
    nutrition_grade_fr?: string;
    nutrition_grades?: string;
    nutrition_score_fr?: number;
    nutriscore_grade?: string;
    nutriscore_score?: number;
    nutriscore_version?: string;
    
    // Nutriments (comprehensive nutrition data)
    nutriments?: {
      // Energy
      energy?: number;
      'energy-kcal'?: number;
      'energy-kj'?: number;
      energy_unit?: string;
      energy_value?: number;
      energy_serving?: number;
      
      // Macronutrients
      fat?: number;
      fat_unit?: string;
      fat_value?: number;
      fat_serving?: number;
      'saturated-fat'?: number;
      'saturated-fat_unit'?: string;
      'saturated-fat_value'?: number;
      'saturated-fat_serving'?: number;
      
      carbohydrates?: number;
      carbohydrates_unit?: string;
      carbohydrates_value?: number;
      carbohydrates_serving?: number;
      
      sugars?: number;
      sugars_unit?: string;
      sugars_value?: number;
      sugars_serving?: number;
      
      fiber?: number;
      fiber_unit?: string;
      fiber_value?: number;
      fiber_serving?: number;
      
      proteins?: number;
      proteins_unit?: string;
      proteins_value?: number;
      proteins_serving?: number;
      
      salt?: number;
      salt_unit?: string;
      salt_value?: number;
      salt_serving?: number;
      
      sodium?: number;
      sodium_unit?: string;
      sodium_value?: number;
      sodium_serving?: number;
      
      // Minerals
      calcium?: number;
      calcium_unit?: string;
      calcium_value?: number;
      calcium_serving?: number;
      calcium_label?: string;
      
      magnesium?: number;
      magnesium_unit?: string;
      magnesium_value?: number;
      magnesium_serving?: number;
      magnesium_label?: string;
      
      potassium?: number;
      potassium_unit?: string;
      potassium_value?: number;
      potassium_serving?: number;
      potassium_label?: string;
      
      // Other compounds
      bicarbonate?: number;
      bicarbonate_unit?: string;
      bicarbonate_value?: number;
      bicarbonate_serving?: number;
      bicarbonate_label?: string;
      
      chloride?: number;
      chloride_unit?: string;
      chloride_value?: number;
      chloride_serving?: number;
      chloride_label?: string;
      
      fluoride?: number;
      fluoride_unit?: string;
      fluoride_value?: number;
      fluoride_serving?: number;
      fluoride_label?: string;
      
      nitrate?: number;
      nitrate_unit?: string;
      nitrate_value?: number;
      nitrate_serving?: number;
      nitrate_label?: string;
      
      silica?: number;
      silica_unit?: string;
      silica_value?: number;
      silica_serving?: number;
      silica_label?: string;
      
      sulphate?: number;
      sulphate_unit?: string;
      sulphate_value?: number;
      sulphate_serving?: number;
      sulphate_label?: string;
      
      // Nova group
      'nova-group'?: number;
      'nova-group_100g'?: number;
      'nova-group_serving'?: number;
      
      // Nutrition score
      'nutrition-score-fr'?: number;
      'nutrition-score-fr_100g'?: number;
      
      // Fruits/vegetables estimate
      'fruits-vegetables-legumes-estimate-from-ingredients_100g'?: number;
      'fruits-vegetables-legumes-estimate-from-ingredients_serving'?: number;
      'fruits-vegetables-nuts-estimate-from-ingredients_100g'?: number;
      'fruits-vegetables-nuts-estimate-from-ingredients_serving'?: number;
      
      // Additional fatty acids
      'alpha-linolenic-acid'?: number;
      'alpha-linolenic-acid_unit'?: string;
      'alpha-linolenic-acid_value'?: number;
      'alpha-linolenic-acid_serving'?: number;
      
      'arachidic-acid'?: number;
      'arachidic-acid_unit'?: string;
      'arachidic-acid_value'?: number;
      'arachidic-acid_serving'?: number;
      
      'arachidonic-acid'?: number;
      'arachidonic-acid_unit'?: string;
      'arachidonic-acid_value'?: number;
      'arachidonic-acid_serving'?: number;
      
      'behenic-acid'?: number;
      'behenic-acid_unit'?: string;
      'behenic-acid_value'?: number;
      'behenic-acid_serving'?: number;
      
      'butyric-acid'?: number;
      'butyric-acid_unit'?: string;
      'butyric-acid_value'?: number;
      'butyric-acid_serving'?: number;
      
      // Vitamins
      biotin?: number;
      biotin_unit?: string;
      biotin_value?: number;
      biotin_serving?: number;
      
      // Carbon footprint
      'carbon-footprint-from-known-ingredients_product'?: number;
    };
    
    // NOVA classification
    nova_group?: number;
    nova_groups?: string;
    nova_groups_tags: string[];
    
    // Food groups
    food_groups?: string;
    food_groups_tags: string[];
    pnns_groups_1?: string;
    pnns_groups_1_tags: string[];
    pnns_groups_2?: string;
    pnns_groups_2_tags: string[];
    
    // Images
    image_front_url?: string;
    image_front_small_url?: string;
    image_front_thumb_url?: string;
    image_ingredients_url?: string;
    image_ingredients_small_url?: string;
    image_ingredients_thumb_url?: string;
    image_nutrition_url?: string;
    image_nutrition_small_url?: string;
    image_nutrition_thumb_url?: string;
    image_packaging_url?: string;
    image_packaging_small_url?: string;
    image_packaging_thumb_url?: string;
    image_url?: string;
    image_small_url?: string;
    image_thumb_url?: string;
    
    // Selected images by language
    selected_images?: {
      front?: {
        display?: Record<string, string>;
        small?: Record<string, string>;
        thumb?: Record<string, string>;
      };
      ingredients?: {
        display?: Record<string, string>;
        small?: Record<string, string>;
        thumb?: Record<string, string>;
      };
      nutrition?: {
        display?: Record<string, string>;
        small?: Record<string, string>;
        thumb?: Record<string, string>;
      };
      packaging?: {
        display?: Record<string, string>;
        small?: Record<string, string>;
        thumb?: Record<string, string>;
      };
    };
    
    // Languages
    languages?: Record<string, number>;
    languages_codes?: Record<string, number>;
    languages_hierarchy: string[];
    languages_tags: string[];
    lang?: string;
    lc?: string;
    
    // Completion and quality
    completeness?: number;
    complete?: number;
    states?: string;
    states_tags: string[];
    states_hierarchy: string[];
    
    // Data quality
    data_quality_tags?: string[];
    data_quality_errors_tags?: string[];
    data_quality_warnings_tags?: string[];
    data_quality_info_tags?: string[];
    
    // Eco-score
    ecoscore_grade?: string;
    ecoscore_tags: string[];
    ecoscore_data?: any;
    
    // Nutri-Score detailed data
    nutriscore_data?: {
      grade: string;
      score: number;
      negative_points: number;
      positive_points: number;
      is_beverage?: number;
      is_cheese?: number;
      is_fat_oil_nuts_seeds?: number;
      is_water?: string;
      components?: {
        negative: Array<{
          id: string;
          points: number;
          points_max: number;
          unit: string;
          value?: number | null;
        }>;
        positive: Array<{
          id: string;
          points: number;
          points_max: number;
          unit: string;
          value?: number | null;
        }>;
      };
    };
    
    // Timestamps
    created_t?: number;
    last_modified_t?: number;
    last_updated_t?: number;
    
    // Contributors
    creator?: string;
    editors?: string[];
    editors_tags: string[];
    photographers?: string[];
    photographers_tags: string[];
    informers?: string[];
    informers_tags: string[];
    correctors?: string[];
    correctors_tags: string[];
    
    // Popularity and scans
    popularity_key?: number;
    popularity_tags: string[];
    scans_n?: number;
    unique_scans_n?: number;
    
    // Misc tags
    misc_tags: string[];
    
    // Other fields
    additives_n?: number;
    additives_tags: string[];
    additives_original_tags: string[];
    
    // Link
    link?: string;
    
    // Sources
    sources?: Array<{
      id: string;
      name: string;
      url?: string;
      source_licence?: string;
      source_licence_url?: string;
      import_t?: number;
      fields?: string[];
      images?: any[];
      manufacturer?: string;
    }>;
    
    // Teams
    teams?: string;
    teams_tags: string[];
    
    // Checkers
    checkers?: string[];
    checkers_tags: string[];
    
    // EMB codes
    emb_codes?: string;
    emb_codes_tags: string[];
    
    // Manufacturing places
    origin?: string;
    origin_en?: string;
    origin_fr?: string;
    origin_de?: string;
    origin_it?: string;
    origin_nl?: string;
    origin_ar?: string;
    origin_ro?: string;
  };
}

function _getBaseUrl(category: string): string {
  return category === 'Food' ? 'https://world.openfoodfacts.org' : 'https://world.openbeautyfacts.org';
}

export async function getProduct(ean: string, category: string): Promise<OpenFoodFactsProduct | null> {
  try {
    // First check cache
    const cachedProduct = await productCache.getProduct(ean);
    if (cachedProduct) {
      console.log('📦 Cache hit! Using cached product for:', ean);
      return cachedProduct;
    }

    console.log('🌐 Cache miss. Fetching from API for:', ean);
    
    // Try both API v2 and v0 for better compatibility
    const urlV2 = `${_getBaseUrl(category)}/api/v2/product/${ean}?lc=en`;
    const urlV0 = `${_getBaseUrl(category)}/api/v0/product/${ean}.json`;

    console.log('Fetching product from:', urlV2);
    
    // First try API v2
    let response = await fetch(urlV2, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'Accept-Language': 'en'
      }
    });
    
    if (!response.ok) {
      console.log('API v2 failed, trying v0:', response.status);
      // Fallback to API v0
      response = await fetch(urlV0, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
          'Accept-Language': 'en'
        }
      });
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const product = await response.json();
    console.log('Product response status:', product.status);
    
    if (product.status === 0 || product.status === "0") {
      console.log('Product not found in database');
      return null;
    }
    
    if (product.status === 1 || product.status === "1") {
      console.log('✅ Product found successfully. Caching...');
      
      // Cache the successful result
      await productCache.setProduct(ean, product);
      
      return product;
    }
    
    console.log('Unexpected status:', product.status);
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get cached product without API call (for quick checks)
export async function getCachedProduct(ean: string): Promise<OpenFoodFactsProduct | null> {
  return await productCache.getProduct(ean);
}

// Check if product is cached
export function isProductCached(ean: string): boolean {
  return productCache.isProductCached(ean);
}

// Get cache statistics
export async function getCacheStats() {
  return await productCache.getCacheStats();
}

// Clear cache
export async function clearProductCache(): Promise<void> {
  await productCache.clearCache();
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
