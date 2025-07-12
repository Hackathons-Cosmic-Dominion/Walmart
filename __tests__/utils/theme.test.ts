import theme, { Theme } from '../../theme';

describe('Theme', () => {
  describe('structure', () => {
    it('should have all required properties', () => {
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('borderRadii');
      expect(theme).toHaveProperty('textVariants');
      expect(theme).toHaveProperty('breakpoints');
    });

    it('should have correct TypeScript type', () => {
      // This test ensures the theme object matches the Theme type
      const themeTest: Theme = theme;
      expect(themeTest).toBeDefined();
    });
  });

  describe('colors', () => {
    it('should have primary color variants', () => {
      expect(theme.colors.primary).toBe('#0071DC');
      expect(theme.colors.primaryDark).toBe('#0056B3');
      expect(theme.colors.primaryLight).toBe('#4A90E2');
    });

    it('should have semantic colors', () => {
      expect(theme.colors.background).toBeDefined();
      expect(theme.colors.surface).toBeDefined();
      expect(theme.colors.text).toBeDefined();
      expect(theme.colors.textSecondary).toBeDefined();
      expect(theme.colors.border).toBeDefined();
    });

    it('should have status colors', () => {
      expect(theme.colors.success).toBeDefined();
      expect(theme.colors.error).toBeDefined();
      expect(theme.colors.warning).toBeDefined();
      expect(theme.colors.info).toBeDefined();
    });

    it('should have consistent gray scale', () => {
      expect(theme.colors.gray50).toBeDefined();
      expect(theme.colors.gray100).toBeDefined();
      expect(theme.colors.gray200).toBeDefined();
      expect(theme.colors.gray300).toBeDefined();
      expect(theme.colors.gray400).toBeDefined();
      expect(theme.colors.gray500).toBeDefined();
      expect(theme.colors.gray600).toBeDefined();
      expect(theme.colors.gray700).toBeDefined();
      expect(theme.colors.gray800).toBeDefined();
      expect(theme.colors.gray900).toBeDefined();
    });
  });

  describe('spacing', () => {
    it('should have consistent spacing scale', () => {
      expect(theme.spacing.xs).toBe(4);
      expect(theme.spacing.s).toBe(8);
      expect(theme.spacing.m).toBe(16);
      expect(theme.spacing.l).toBe(24);
      expect(theme.spacing.xl).toBe(32);
      expect(theme.spacing.xxl).toBe(48);
      expect(theme.spacing.xxxl).toBe(64);
    });

    it('should have ascending spacing values', () => {
      const spacingValues = Object.values(theme.spacing);
      for (let i = 1; i < spacingValues.length; i++) {
        expect(spacingValues[i]).toBeGreaterThan(spacingValues[i - 1]);
      }
    });
  });

  describe('borderRadii', () => {
    it('should have border radius variants', () => {
      expect(theme.borderRadii.s).toBe(4);
      expect(theme.borderRadii.m).toBe(8);
      expect(theme.borderRadii.l).toBe(12);
      expect(theme.borderRadii.xl).toBe(16);
      expect(theme.borderRadii.xxl).toBe(24);
      expect(theme.borderRadii.round).toBe(999);
    });

    it('should have ascending border radius values (except round)', () => {
      const { round, ...otherRadii } = theme.borderRadii;
      const radiusValues = Object.values(otherRadii);
      for (let i = 1; i < radiusValues.length; i++) {
        expect(radiusValues[i]).toBeGreaterThan(radiusValues[i - 1]);
      }
    });
  });

  describe('textVariants', () => {
    it('should have all text variants', () => {
      expect(theme.textVariants.header).toBeDefined();
      expect(theme.textVariants.header2).toBeDefined();
      expect(theme.textVariants.header3).toBeDefined();
      expect(theme.textVariants.body).toBeDefined();
      expect(theme.textVariants.bodySmall).toBeDefined();
      expect(theme.textVariants.caption).toBeDefined();
      expect(theme.textVariants.button).toBeDefined();
      expect(theme.textVariants.price).toBeDefined();
      expect(theme.textVariants.priceSmall).toBeDefined();
    });

    it('should have consistent font size hierarchy', () => {
      expect(theme.textVariants.header.fontSize).toBeGreaterThan(theme.textVariants.header2.fontSize);
      expect(theme.textVariants.header2.fontSize).toBeGreaterThan(theme.textVariants.header3.fontSize);
      expect(theme.textVariants.body.fontSize).toBeGreaterThan(theme.textVariants.bodySmall.fontSize);
      expect(theme.textVariants.bodySmall.fontSize).toBeGreaterThan(theme.textVariants.caption.fontSize);
    });

    it('should have required font properties', () => {
      Object.values(theme.textVariants).forEach(variant => {
        expect(variant).toHaveProperty('fontSize');
        expect(variant).toHaveProperty('color');
        expect(typeof variant.fontSize).toBe('number');
        expect(typeof variant.color).toBe('string');
      });
    });
  });

  describe('breakpoints', () => {
    it('should have responsive breakpoints', () => {
      expect(theme.breakpoints.phone).toBe(0);
      expect(theme.breakpoints.tablet).toBe(768);
    });

    it('should have ascending breakpoint values', () => {
      expect(theme.breakpoints.tablet).toBeGreaterThan(theme.breakpoints.phone);
    });
  });

  describe('color accessibility', () => {
    it('should use high contrast colors for text', () => {
      // Ensure dark text on light background
      expect(theme.colors.text).toBe(theme.colors.gray900);
      expect(theme.colors.background).toBe(theme.colors.white);
    });

    it('should have distinct border colors', () => {
      expect(theme.colors.border).not.toBe(theme.colors.background);
      expect(theme.colors.divider).not.toBe(theme.colors.background);
    });
  });
});
