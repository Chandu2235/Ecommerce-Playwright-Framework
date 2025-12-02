interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
}

interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  score: number;
  suggestions: string[];
}

class ProductSearchService {
  private products: Product[] = [];

  constructor(products: Product[]) {
    this.products = products;
  }

  search(filters: SearchFilters): Product[] {
    return this.products.filter(product => {
      // Text search in name and description
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesText = 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesText) return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // Stock filter
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          product.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }

  searchByRelevance(query: string): Product[] {
    const results = this.products.map(product => {
      let score = 0;
      const queryLower = query.toLowerCase();

      // Exact name match gets highest score
      if (product.name.toLowerCase() === queryLower) score += 100;
      else if (product.name.toLowerCase().includes(queryLower)) score += 50;

      // Description match
      if (product.description.toLowerCase().includes(queryLower)) score += 30;

      // Tag matches
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) score += 20;
      });

      // Category match
      if (product.category.toLowerCase().includes(queryLower)) score += 10;

      return { product, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.product);

    return results;
  }
}

class ProductDescriptionValidator {
  private readonly minLength = 10;
  private readonly maxLength = 500;
  private readonly requiredKeywords = ['features', 'benefits', 'specifications'];
  private readonly forbiddenWords = ['spam', 'fake', 'scam'];

  validateDescription(description: string): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Length validation
    if (description.length < this.minLength) {
      errors.push(`Description too short. Minimum ${this.minLength} characters required.`);
      suggestions.push('Add more detailed product information');
      score -= 20;
    }

    if (description.length > this.maxLength) {
      errors.push(`Description too long. Maximum ${this.maxLength} characters allowed.`);
      suggestions.push('Condense the description to key points');
      score -= 15;
    }

    // Content quality validation
    if (!/[.!?]/.test(description)) {
      errors.push('Description should contain proper punctuation');
      suggestions.push('Add periods, exclamation marks, or question marks');
      score -= 10;
    }

    // Check for forbidden words
    const lowerDescription = description.toLowerCase();
    this.forbiddenWords.forEach(word => {
      if (lowerDescription.includes(word)) {
        errors.push(`Contains inappropriate word: "${word}"`);
        score -= 30;
      }
    });

    // Check for recommended keywords
    const hasKeywords = this.requiredKeywords.some(keyword => 
      lowerDescription.includes(keyword)
    );
    if (!hasKeywords) {
      suggestions.push('Consider including keywords like: features, benefits, or specifications');
      score -= 5;
    }

    // Grammar and readability checks
    if (description.split(' ').length < 5) {
      errors.push('Description should contain at least 5 words');
      score -= 15;
    }

    // Check for excessive capitalization
    const upperCaseRatio = (description.match(/[A-Z]/g) || []).length / description.length;
    if (upperCaseRatio > 0.3) {
      errors.push('Too many capital letters. Use normal sentence case.');
      suggestions.push('Convert to proper sentence case');
      score -= 10;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.max(0, score),
      suggestions
    };
  }

  analyzeDescriptions(products: Product[]): {
    totalProducts: number;
    validDescriptions: number;
    invalidDescriptions: number;
    averageScore: number;
    commonIssues: { [key: string]: number };
    recommendations: string[];
  } {
    const results = products.map(product => 
      this.validateDescription(product.description)
    );

    const validCount = results.filter(r => r.isValid).length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Count common issues
    const commonIssues: { [key: string]: number } = {};
    results.forEach(result => {
      result.errors.forEach(error => {
        const issueType = error.split('.')[0]; // Get first sentence as issue type
        commonIssues[issueType] = (commonIssues[issueType] || 0) + 1;
      });
    });

    // Generate recommendations
    const recommendations: string[] = [];
    if (validCount / products.length < 0.8) {
      recommendations.push('Focus on improving description quality - less than 80% are valid');
    }
    if (averageScore < 70) {
      recommendations.push('Average description score is low - consider content guidelines');
    }

    const topIssue = Object.keys(commonIssues).reduce((a, b) => 
      commonIssues[a] > commonIssues[b] ? a : b, ''
    );
    if (topIssue) {
      recommendations.push(`Most common issue: ${topIssue} - create specific guidelines`);
    }

    return {
      totalProducts: products.length,
      validDescriptions: validCount,
      invalidDescriptions: products.length - validCount,
      averageScore: Math.round(averageScore * 100) / 100,
      commonIssues,
      recommendations
    };
  }
}

// Usage example and utility functions
class ProductAnalyzer {
  private searchService: ProductSearchService;
  private validator: ProductDescriptionValidator;

  constructor(products: Product[]) {
    this.searchService = new ProductSearchService(products);
    this.validator = new ProductDescriptionValidator();
  }

  searchProducts(filters: SearchFilters): Product[] {
    return this.searchService.search(filters);
  }

  searchByQuery(query: string): Product[] {
    return this.searchService.searchByRelevance(query);
  }

  validateProduct(product: Product): ValidationResult {
    return this.validator.validateDescription(product.description);
  }

  generateReport(products: Product[]) {
    const analysis = this.validator.analyzeDescriptions(products);
    
    console.log('=== Product Description Analysis Report ===');
    console.log(`Total Products: ${analysis.totalProducts}`);
    console.log(`Valid Descriptions: ${analysis.validDescriptions}`);
    console.log(`Invalid Descriptions: ${analysis.invalidDescriptions}`);
    console.log(`Average Score: ${analysis.averageScore}/100`);
    console.log('\nCommon Issues:');
    Object.entries(analysis.commonIssues).forEach(([issue, count]) => {
      console.log(`  - ${issue}: ${count} occurrences`);
    });
    console.log('\nRecommendations:');
    analysis.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });

    return analysis;
  }

  findProductsWithIssues(products: Product[]): Array<{product: Product, validation: ValidationResult}> {
    return products
      .map(product => ({
        product,
        validation: this.validator.validateDescription(product.description)
      }))
      .filter(item => !item.validation.isValid);
  }
}
