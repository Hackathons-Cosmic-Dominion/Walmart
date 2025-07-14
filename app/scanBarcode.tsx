import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getProduct, OpenFoodFactsProduct } from '../api/OpenFoodFacts';
import theme from '../theme';

const { width } = Dimensions.get('window');

export default function ScanBarcodeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [productData, setProductData] = useState<OpenFoodFactsProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setIsLoading(true);

    try {
      console.log('Scanning barcode:', data);
      
      // Try to fetch product from Open Food Facts
      const product = await getProduct(data, 'Food');
      
      // console.log('Product result:', product);
      
      if (product && product.product) {
        console.log('Product found, showing modal');
        setProductData(product);
        setShowProductModal(true);
      } else {
        console.log('Product not found, showing add dialog');
        // Product not found, offer to add it
        Alert.alert(
          'Product Not Found',
          `Barcode: ${data}\n\nThis product is not in the Open Food Facts database. Would you like to add it?`,
          [
            {
              text: 'Cancel',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
            {
              text: 'Add Product',
              onPress: () => {
                router.push({
                  pathname: '/addProduct' as any,
                  params: { 
                    ean: data,
                    category: 'Food' 
                  },
                });
              },
            },
            {
              text: 'Try Again',
              onPress: () => setScanned(false),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert(
        'Error',
        `Failed to fetch product information: ${error instanceof Error ? error.message : 'Unknown error'}\n\nBarcode: ${data}`,
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Add Manually',
            onPress: () => {
              router.push({
                pathname: '/addProduct' as any,
                params: { 
                  ean: data,
                  category: 'Food' 
                },
              });
            },
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setProductData(null);
    setShowProductModal(false);
  };

  const closeModal = () => {
    setShowProductModal(false);
    setScanned(false);
  };

  const getProductName = (product: any) => {
    return product.product_name_en || product.product_name || 'Unknown Product';
  };

  const getGenericName = (product: any) => {
    return product.generic_name_en || product.generic_name || null;
  };

  const getIngredientsText = (product: any) => {
    return product.ingredients_text_en || product.ingredients_text || null;
  };

  const renderNutritionFacts = (nutriments: any) => {
    if (!nutriments) return null;

    const nutritionItems = [
      { key: 'energy-kcal', label: 'Energy', unit: 'kcal', icon: 'flash-outline' },
      { key: 'fat', label: 'Fat', unit: 'g', icon: 'water-outline' },
      { key: 'saturated-fat', label: 'Saturated Fat', unit: 'g', icon: 'water-outline', isSubItem: true },
      { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g', icon: 'nutrition-outline' },
      { key: 'sugars', label: 'Sugars', unit: 'g', icon: 'nutrition-outline', isSubItem: true },
      { key: 'fiber', label: 'Fiber', unit: 'g', icon: 'leaf-outline' },
      { key: 'proteins', label: 'Protein', unit: 'g', icon: 'fitness-outline' },
      { key: 'salt', label: 'Salt', unit: 'g', icon: 'cube-outline' },
      { key: 'sodium', label: 'Sodium', unit: 'mg', icon: 'cube-outline', isSubItem: true },
    ];

    return (
      <View style={styles.nutritionSection}>
        <Text style={styles.sectionTitle}>Nutrition Facts (per 100g)</Text>
        {nutritionItems.map((item) => {
          const value = nutriments[item.key];
          if (value === undefined || value === null) return null;

          return (
            <View key={item.key} style={[styles.nutritionRow, item.isSubItem && styles.nutritionSubRow]}>
              <Ionicons name={item.icon as any} size={16} color={theme.colors.primary} />
              <Text style={[styles.nutritionLabel, item.isSubItem && styles.nutritionSubLabel]}>
                {item.label}
              </Text>
              <Text style={styles.nutritionValue}>
                {typeof value === 'number' ? value.toFixed(1) : value} {item.unit}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderMinerals = (nutriments: any) => {
    if (!nutriments) return null;

    const minerals = [
      { key: 'calcium', label: 'Calcium', unit: 'mg' },
      { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
      { key: 'potassium', label: 'Potassium', unit: 'mg' },
      { key: 'bicarbonate', label: 'Bicarbonate', unit: 'mg' },
      { key: 'chloride', label: 'Chloride', unit: 'mg' },
      { key: 'fluoride', label: 'Fluoride', unit: 'mg' },
      { key: 'nitrate', label: 'Nitrate', unit: 'mg' },
      { key: 'silica', label: 'Silica', unit: 'mg' },
      { key: 'sulphate', label: 'Sulphate', unit: 'mg' },
    ];

    const availableMinerals = minerals.filter(mineral => 
      nutriments[mineral.key] !== undefined && nutriments[mineral.key] !== null
    );

    if (availableMinerals.length === 0) return null;

    return (
      <View style={styles.mineralsSection}>
        <Text style={styles.sectionTitle}>Minerals & Compounds</Text>
        {availableMinerals.map((mineral) => {
          const value = nutriments[mineral.key];
          return (
            <View key={mineral.key} style={styles.mineralRow}>
              <Ionicons name="diamond-outline" size={16} color={theme.colors.secondary} />
              <Text style={styles.mineralLabel}>{mineral.label}</Text>
              <Text style={styles.mineralValue}>
                {typeof value === 'number' ? value.toFixed(3) : value} {mineral.unit}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCertifications = (labels: string[], ecoscore?: string) => {
    if (!labels || labels.length === 0) return null;

    // Common certification labels to highlight
    const certificationKeywords = [
      'organic', 'bio', 'vegan', 'vegetarian', 'gluten-free', 'fair-trade', 
      'sustainable', 'non-gmo', 'kosher', 'halal', 'recyclable'
    ];

    const certifications = labels.filter(label => 
      certificationKeywords.some(keyword => 
        label.toLowerCase().includes(keyword)
      )
    );

    if (certifications.length === 0 && !ecoscore) return null;

    return (
      <View style={styles.certificationsSection}>
        <Text style={styles.sectionTitle}>Certifications & Eco-Score</Text>
        {ecoscore && (
          <View style={styles.certificationBadge}>
            <Ionicons name="leaf" size={16} color="#22C55E" />
            <Text style={styles.certificationText}>Eco-Score: {ecoscore.toUpperCase()}</Text>
          </View>
        )}
        {certifications.map((cert, index) => (
          <View key={index} style={styles.certificationBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.certificationText}>{cert}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPackagingInfo = (packagings: any[] | undefined) => {
    if (!packagings || packagings.length === 0) return null;

    return (
      <View style={styles.packagingSection}>
        <Text style={styles.sectionTitle}>Packaging Information</Text>
        {packagings.map((pkg, index) => (
          <View key={index} style={styles.packagingItem}>
            <Ionicons name="cube-outline" size={16} color={theme.colors.secondary} />
            <View style={styles.packagingDetails}>
              {pkg.material && (
                <Text style={styles.packagingText}>Material: {pkg.material.replace('en:', '')}</Text>
              )}
              {pkg.shape && (
                <Text style={styles.packagingText}>Shape: {pkg.shape.replace('en:', '')}</Text>
              )}
              {pkg.recycling && (
                <Text style={styles.packagingText}>Recycling: {pkg.recycling.replace('en:', '')}</Text>
              )}
              {pkg.weight_measured && (
                <Text style={styles.packagingText}>Weight: {pkg.weight_measured}g</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderOriginInfo = (product: any) => {
    const origin = product.origins || product.origin_en || product.origin;
    const manufacturingPlaces = product.manufacturing_places;
    const countries = product.countries;

    if (!origin && !manufacturingPlaces && !countries) return null;

    return (
      <View style={styles.originSection}>
        <Text style={styles.sectionTitle}>Origin & Manufacturing</Text>
        {origin && (
          <View style={styles.originRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.originLabel}>Origin:</Text>
            <Text style={styles.originValue}>{origin}</Text>
          </View>
        )}
        {manufacturingPlaces && (
          <View style={styles.originRow}>
            <Ionicons name="business-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.originLabel}>Manufactured:</Text>
            <Text style={styles.originValue}>{manufacturingPlaces}</Text>
          </View>
        )}
        {countries && (
          <View style={styles.originRow}>
            <Ionicons name="globe-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.originLabel}>Sold in:</Text>
            <Text style={styles.originValue}>{countries}</Text>
          </View>
        )}
      </View>
    );
  };

  if (!permission) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Barcode Scanner</Text>
        </View>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.permissionText}>Camera access is required to scan barcodes</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "ean8", "upc_e", "qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {isLoading ? 'Fetching product data...' : 'Point your camera at a barcode'}
            </Text>
            {scanned && !isLoading && (
              <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
                <Text style={styles.resetButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>

      {/* Enhanced Product Details Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Complete Product Information</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {productData?.product && (
              <View style={styles.productDetails}>
                {/* Product Image */}
                {productData.product.image_front_url && (
                  <Image 
                    source={{ uri: productData.product.image_front_url }} 
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                )}

                {/* Product Name & Generic Name */}
                <Text style={styles.productName}>
                  {getProductName(productData.product)}
                </Text>
                {getGenericName(productData.product) && (
                  <Text style={styles.genericName}>
                    {getGenericName(productData.product)}
                  </Text>
                )}

                {/* Basic Info */}
                <View style={styles.basicInfoSection}>
                  {/* Brand */}
                  {productData.product.brands && (
                    <View style={styles.detailRow}>
                      <Ionicons name="business-outline" size={20} color={theme.colors.primary} />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Brand</Text>
                        <Text style={styles.detailValue}>{productData.product.brands}</Text>
                      </View>
                    </View>
                  )}

                  {/* Categories */}
                  {productData.product.categories && (
                    <View style={styles.detailRow}>
                      <Ionicons name="grid-outline" size={20} color={theme.colors.primary} />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Categories</Text>
                        <Text style={styles.detailValue}>{productData.product.categories}</Text>
                      </View>
                    </View>
                  )}

                  {/* Quantity */}
                  {productData.product.quantity && (
                    <View style={styles.detailRow}>
                      <Ionicons name="scale-outline" size={20} color={theme.colors.primary} />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Quantity</Text>
                        <Text style={styles.detailValue}>{productData.product.quantity}</Text>
                      </View>
                    </View>
                  )}

                  {/* Nutrition Grade */}
                  {(productData.product.nutrition_grade_fr || productData.product.nutriscore_grade) && (
                    <View style={styles.detailRow}>
                      <Ionicons name="fitness-outline" size={20} color={theme.colors.primary} />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Nutri-Score</Text>
                        <View style={styles.nutritionGrade}>
                          <Text style={[
                            styles.nutritionGradeText,
                            { backgroundColor: getNutritionGradeColor(productData.product.nutrition_grade_fr || productData.product.nutriscore_grade || '') }
                          ]}>
                            {(productData.product.nutrition_grade_fr || productData.product.nutriscore_grade || '').toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* NOVA Group */}
                  {productData.product.nova_group && (
                    <View style={styles.detailRow}>
                      <Ionicons name="fast-food-outline" size={20} color={theme.colors.primary} />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>NOVA Group (Processing Level)</Text>
                        <Text style={styles.detailValue}>Group {productData.product.nova_group}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Ingredients */}
                {getIngredientsText(productData.product) && (
                  <View style={styles.ingredientsSection}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    <Text style={styles.ingredientsText}>{getIngredientsText(productData.product)}</Text>
                  </View>
                )}

                {/* Nutrition Facts */}
                {renderNutritionFacts(productData.product.nutriments)}

                {/* Minerals & Compounds */}
                {renderMinerals(productData.product.nutriments)}

                {/* Certifications & Labels */}
                {renderCertifications(productData.product.labels_tags, productData.product.ecoscore_grade)}

                {/* Packaging Information */}
                {renderPackagingInfo(productData.product.packagings)}

                {/* Origin & Manufacturing */}
                {renderOriginInfo(productData.product)}

                {/* Data Quality Indicator */}
                {productData.product.completeness && (
                  <View style={styles.qualitySection}>
                    <Text style={styles.sectionTitle}>Data Quality</Text>
                    <View style={styles.qualityRow}>
                      <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.success} />
                      <Text style={styles.qualityText}>
                        Completeness: {Math.round(productData.product.completeness * 100)}%
                      </Text>
                    </View>
                    {productData.product.scans_n && (
                      <View style={styles.qualityRow}>
                        <Ionicons name="eye-outline" size={16} color={theme.colors.info} />
                        <Text style={styles.qualityText}>
                          Scanned {productData.product.scans_n} times
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                      closeModal();
                      router.push({
                        pathname: '/addProduct' as any,
                        params: { 
                          ean: productData.product?.code,
                          category: 'Food',
                          mode: 'edit'
                        },
                      });
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color={theme.colors.white} />
                    <Text style={styles.editButtonText}>Edit Product</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const getNutritionGradeColor = (grade: string): string => {
  switch (grade.toLowerCase()) {
    case 'a': return '#00B74A';
    case 'b': return '#85BB2F';
    case 'c': return '#F5A623';
    case 'd': return '#F56500';
    case 'e': return '#E74C3C';
    default: return theme.colors.gray500;
  }
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  permissionText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: theme.spacing.l,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
  },
  permissionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: theme.colors.white,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: theme.colors.white,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: theme.colors.white,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: theme.colors.white,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  instructionText: {
    color: theme.colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadii.m,
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
  },
  resetButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.s,
  },
  modalContent: {
    flex: 1,
  },
  productDetails: {
    padding: theme.spacing.m,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadii.m,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  genericName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  basicInfoSection: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.l,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
  },
  detailContent: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  nutritionGrade: {
    alignSelf: 'flex-start',
  },
  nutritionGradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadii.s,
    overflow: 'hidden',
  },
  ingredientsSection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadii.m,
  },
  ingredientsText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  nutritionSection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: '#EBF8FF',
    borderRadius: theme.borderRadii.m,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  nutritionSubRow: {
    paddingLeft: theme.spacing.l,
  },
  nutritionLabel: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  nutritionSubLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  nutritionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  mineralsSection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: '#F0FDF4',
    borderRadius: theme.borderRadii.m,
  },
  mineralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  mineralLabel: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  mineralValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  certificationsSection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: '#ECFDF5',
    borderRadius: theme.borderRadii.m,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadii.s,
  },
  certificationText: {
    marginLeft: theme.spacing.s,
    fontSize: 14,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  packagingSection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: '#FFFBEB',
    borderRadius: theme.borderRadii.m,
  },
  packagingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.m,
  },
  packagingDetails: {
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  packagingText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  originSection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: '#FAF5FF',
    borderRadius: theme.borderRadii.m,
  },
  originRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  originLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.s,
    minWidth: 80,
  },
  originValue: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  qualitySection: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadii.m,
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  qualityText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  actionButtons: {
    marginTop: theme.spacing.xl,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
  },
  editButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.s,
  },
});
