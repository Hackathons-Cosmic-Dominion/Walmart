import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getProduct, OpenFoodFactsProduct } from '../api/OpenFoodFacts';
import theme from '../theme';

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
      // Try to fetch product from Open Food Facts
      const product = await getProduct(data, 'Food');
      
      if (product && product.product) {
        setProductData(product);
        setShowProductModal(true);
      } else {
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
          ]
        );
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert(
        'Error',
        'Failed to fetch product information. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setScanned(false),
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
          barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "codabar", "itf14", "datamatrix"],
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
              {isLoading ? 'Fetching product details...' : 'Point your camera at a barcode'}
            </Text>
            {scanned && !isLoading && (
              <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
                <Text style={styles.resetButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>

      {/* Product Details Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Product Details</Text>
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

                {/* Product Name */}
                <Text style={styles.productName}>
                  {productData.product.product_name || 'Unknown Product'}
                </Text>

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

                {/* Labels */}
                {productData.product.labels && (
                  <View style={styles.detailRow}>
                    <Ionicons name="pricetag-outline" size={20} color={theme.colors.primary} />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Labels</Text>
                      <Text style={styles.detailValue}>{productData.product.labels}</Text>
                    </View>
                  </View>
                )}

                {/* Nutrition Grade */}
                {productData.product.nutrition_grade_fr && (
                  <View style={styles.detailRow}>
                    <Ionicons name="fitness-outline" size={20} color={theme.colors.primary} />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Nutrition Grade</Text>
                      <View style={styles.nutritionGrade}>
                        <Text style={[
                          styles.nutritionGradeText,
                          { backgroundColor: getNutritionGradeColor(productData.product.nutrition_grade_fr) }
                        ]}>
                          {productData.product.nutrition_grade_fr.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Ingredients */}
                {productData.product.ingredients_text && (
                  <View style={styles.detailRow}>
                    <Ionicons name="list-outline" size={20} color={theme.colors.primary} />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Ingredients</Text>
                      <Text style={styles.detailValue}>{productData.product.ingredients_text}</Text>
                    </View>
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
    marginBottom: theme.spacing.l,
    textAlign: 'center',
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
