import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProduct, uploadProductToOFF } from '../api/OpenFoodFacts';
import { getPicturePath, WHOLE, INGREDIENTS, NUTRITION } from './takePicture';
import theme from '../theme';

export const FOOD = 'Food';
export const BEAUTY = 'Beauty';

const ADD_PRODUCT = 'Add Product';
const EDIT_PRODUCT = 'Update Product';

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [textBrand, setTextBrand] = useState('');
  const [textName, setTextName] = useState('');
  const [textLabel, setTextLabel] = useState('');
  const [textCategory, setTextCategory] = useState('');
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [existingName, setExistingName] = useState('');
  const [existingBrand, setExistingBrand] = useState('');
  const [existingLabels, setExistingLabels] = useState('');
  const [existingCategories, setExistingCategories] = useState('');
  const [status, setStatus] = useState(ADD_PRODUCT);
  const [isLoading, setIsLoading] = useState(false);

  const getEan = () => params.ean as string || '';
  const getCategory = () => (params.category as string) || FOOD;
  const isEditMode = () => params.mode === 'edit';

  const getPicturePathParam = (name: string) => {
    return params[getPicturePath(name)] as string;
  };

  useEffect(() => {
    const checkExistingProduct = async () => {
      const ean = getEan();
      if (!ean) return;

      const offProduct = await getProduct(ean, getCategory());
      if (offProduct !== null) {
        if (!isEditMode()) {
          Alert.alert(
            'Product Found',
            'This product already exists in Open Food Facts. You can update the information and add new photos.'
          );
        }
        const product = offProduct.product;
        if (product) {
          setExistingName(product.product_name || '');
          setTextName(product.product_name || '');
          setExistingLabels(product.labels || '');
          setExistingCategories(product.categories || '');
          setExistingBrand(product.brands || '');
          setAlreadyExist(true);
          setStatus(EDIT_PRODUCT);
        }
      }
    };

    checkExistingProduct();
  }, []);

  const navigateToCamera = (pictureType: string) => {
    router.push({
      pathname: '/takePicture' as any,
      params: { name: pictureType },
    });
  };

  const renderPicture = (path: string | undefined) => {
    if (path) {
      return <Image style={styles.picturePreview} source={{ uri: path }} />;
    }
    return <View style={styles.picturePreview} />;
  };

  const renderPictureSection = (name: string, title: string, icon: string) => {
    const picturePath = getPicturePathParam(name);
    
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        
        <Text style={styles.sectionDescription}>
          Tap the camera to take a photo, your capture will display below!
        </Text>
        
        <View style={styles.pictureContainer}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => navigateToCamera(name)}
          >
            <Ionicons name="camera" size={40} color={theme.colors.primary} />
          </TouchableOpacity>
          {renderPicture(picturePath)}
        </View>
      </View>
    );
  };

  const renderBrandSection = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {existingBrand 
            ? `Existing brands: "${existingBrand}". Add another brand:` 
            : '*Brand Names:'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Jardin Bio, Léa Nature"
          value={textBrand}
          onChangeText={setTextBrand}
        />
      </View>
    );
  };

  const renderNameSection = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {existingName ? 'Rename the product:' : '*Product Name:'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Green Beans"
          value={textName}
          onChangeText={setTextName}
        />
      </View>
    );
  };

  const renderLabelsSection = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {existingLabels
            ? `Existing labels: "${existingLabels}". Add other labels (comma separated):`
            : 'Product labels (comma separated):'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Organic, Gluten-Free"
          value={textLabel}
          onChangeText={setTextLabel}
        />
      </View>
    );
  };

  const renderCategoriesSection = () => {
    const exampleCategory = getCategory() === FOOD ? 'Prepared meal' : 'Body care';
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {existingCategories
            ? `Existing categories: "${existingCategories}". Add other categories (comma separated):`
            : 'Product categories (comma separated):'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={`e.g., ${exampleCategory}`}
          value={textCategory}
          onChangeText={setTextCategory}
        />
      </View>
    );
  };

  const verifyProduct = () => {
    if (!textBrand && !existingBrand) {
      return false;
    }
    if (!textName && !existingName) {
      return false;
    }
    return true;
  };

  const validateProduct = async () => {
    if (!verifyProduct()) {
      Alert.alert(
        'Missing Information',
        'Product name and brand must be filled in.'
      );
      return;
    }

    setIsLoading(true);
    setStatus('Adding product...');

    const args: any = {
      ean: getEan(),
      name: textName,
      brand: textBrand,
      wholePicture: getPicturePathParam(WHOLE),
      ingredientsPicture: getPicturePathParam(INGREDIENTS),
      labels: textLabel,
      categories: textCategory,
      category: getCategory() as 'Food' | 'Beauty',
    };

    if (getCategory() === FOOD) {
      args.nutritionPicture = getPicturePathParam(NUTRITION);
    }

    try {
      await uploadProductToOFF(args);
      Alert.alert(
        'Product Added',
        'This product has been successfully added. Thank you for your contribution!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'This product could not be added. Please try again.'
      );
      setStatus(alreadyExist ? EDIT_PRODUCT : ADD_PRODUCT);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add or Edit Product</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Description Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Product Description</Text>
          </View>
          
          {renderBrandSection()}
          {renderNameSection()}
          {renderLabelsSection()}
          {renderCategoriesSection()}
        </View>

        {/* Picture Sections */}
        {renderPictureSection(WHOLE, 'Add Product Photo', 'camera')}
        {renderPictureSection(INGREDIENTS, 'Add Ingredients Photo', 'list')}
        {getCategory() === FOOD && renderPictureSection(NUTRITION, 'Add Nutrition Photo', 'fitness')}

        <TouchableOpacity
          style={[styles.validateButton, isLoading && styles.validateButtonDisabled]}
          onPress={validateProduct}
          disabled={isLoading}
        >
          <Text style={styles.validateButtonText}>{status}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.m,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.m,
  },
  sectionContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadii.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
  },
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  inputLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.s,
    padding: theme.spacing.m,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  pictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
  },
  picturePreview: {
    width: 120,
    height: 160,
    borderRadius: theme.borderRadii.s,
    backgroundColor: theme.colors.gray100,
    marginLeft: theme.spacing.m,
  },
  validateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  validateButtonDisabled: {
    opacity: 0.5,
  },
  validateButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
