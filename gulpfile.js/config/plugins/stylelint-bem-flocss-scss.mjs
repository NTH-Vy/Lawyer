import stylelint from 'stylelint';
import { relative } from 'path';
import { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as sass from 'sass';
import * as cssParse from 'css';

// BEM pattern: block__element--modifier
const BEM_PATTERN = /^(?:fc-)?(?:[a-z][-a-z0-9]+(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--[a-z0-9]+)?)$/;

// FLOCSS pattern: l-, p-, c-, u-, js-, is-, wf- prefixes
const FLOCSS_PATTERN = /^(?:fc-)?(?:[lpcu]-(?:[a-z0-9]+(?:-[a-z0-9]+)*)|js-[a-z0-9]+(?:-[a-z0-9]+)*|is-[a-z0-9]+(?:-[a-z0-9]+)*|wf-[a-z0-9]+(?:-[a-z0-9]+)*)$/;

// Determine which pattern to use based on configuration and file path
const getPatternForFile = (filePath, config) => {
  const relativePath = relative(process.cwd(), filePath).replace(/\\/g, '/');
  const patternBem = {
    pattern: BEM_PATTERN,
    type: 'BEM',
    message: 'Class names must follow the BEM naming convention'
  };
  const patternFlocss = {
    pattern: FLOCSS_PATTERN,
    type: 'FLOCSS',
    message: 'Class names must follow the FLOCSS naming convention'
  };
  
  // If config specifies a specific pattern, use it
  if (config === 'bem') {
    return patternBem;
  }
  
  if (config === 'flocss') {
    return patternFlocss;
  }
  
  // If config is true or auto, determine based on file path
  // FLOCSS directories
  if (relativePath.includes('/_foundation/') || 
      relativePath.includes('/_layout/') || 
      relativePath.includes('/_object/') ||
      relativePath.includes('/_object/_component/') ||
      relativePath.includes('/_object/_utility/')) {
    return patternFlocss;
  }
  
  // Default to BEM for other files
  return patternBem;
};

// Compile SCSS to CSS and extract class names from the compiled CSS
const extractClassNamesFromCompiledCSS = async (scssContent, filePath) => {
  const tempDir = join(process.cwd(), 'tmp');
  
  // Ensure tmp directory exists
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  
  const tempScssFile = join(tempDir, `temp_${Date.now()}.scss`);
  
  try {
    // Write SCSS content to temporary file
    writeFileSync(tempScssFile, scssContent, 'utf8');
    
    // Compile SCSS to CSS using sass directly
    const result = sass.compile(tempScssFile, {
      style: 'expanded'
    });

    // Parse CSS and extract class names
    const classNames = extractClassNamesFromCSS(result.css);
    
    // Clean up temporary file
    try {
      unlinkSync(tempScssFile);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    return classNames;
  } catch (error) {
    // Silently handle SCSS compilation errors (e.g., undefined mixins)
    // These are expected when checking individual SCSS files without full context
    
    // Clean up temporary file
    try {
      unlinkSync(tempScssFile);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    // Fall back to regex-based extraction from SCSS content
    return extractClassNamesFromSCSS(scssContent);
  }
};

// Extract class names directly from SCSS content using regex
// This is a fallback when SCSS compilation fails due to missing mixins
const extractClassNamesFromSCSS = (scssContent) => {
  const classNames = [];
  
  // Find all class selectors in SCSS content
  // This regex matches class selectors including nested ones
  const classSelectorRegex = /\.([a-zA-Z0-9_-]+)(?=\s*[#{}\s,])/g;
  let match;
  
  while ((match = classSelectorRegex.exec(scssContent)) !== null) {
    const className = match[1];
    // Skip common SCSS keywords and variables
    if (!['if', 'else', 'for', 'each', 'while', 'function', 'mixin', 'include', 'extend'].includes(className)) {
      classNames.push(className);
    }
  }
  
  return [...new Set(classNames)]; // Remove duplicates
};

// Extract class names from compiled CSS
const extractClassNamesFromCSS = (cssContent) => {
  const classNames = [];
  
  try {
    const cssAst = cssParse.parse(cssContent);
    
    cssAst.stylesheet.rules.forEach((rule) => {
      if (rule.type === 'rule') {
        rule.selectors.forEach((selector) => {
          // Extract class names from selector
          const classMatches = selector.match(/\.[a-zA-Z0-9_-]+/g) || [];
          
          classMatches.forEach(match => {
            // Remove the leading dot and clean up
            const className = match.slice(1);
            
            // Skip empty or invalid class names
            if (className && className.trim() !== '') {
              classNames.push(className);
            }
          });
        });
      }
    });
  } catch (error) {
    console.warn('Error parsing CSS:', error.message);
  }
  
  return [...new Set(classNames)]; // Remove duplicates
};

// Check if a class name matches the expected pattern
const validateClassName = (className, pattern, type) => {
  // Skip empty or invalid class names
  if (!className || className.trim() === '') {
    return { valid: true };
  }
  
  // Skip class names that are clearly not meant to be checked
  // (e.g., generated class names, framework classes)
  if (className.startsWith('_') || 
      className.includes('$') || 
      className.includes('@') ||
      className.match(/^[0-9]/)) {
    return { valid: true };
  }
  
  const isValid = pattern.test(className);
  
  return {
    valid: isValid,
    message: isValid ? null : `${type} naming convention violation: "${className}"`
  };
};

const bemFlocssScss = stylelint.createPlugin('plugin/bem-flocss-scss', (config) => {
  return async (root, result) => {
    if (config === false) return;
    console.log('bemFlocssScss check plugin is running...');
    
    const filePath = root.source?.input?.file;
    if (!filePath) return;
    
    const { pattern, type, message } = getPatternForFile(filePath, config);
    
    try {
      // Get the original SCSS content
      const scssContent = root.source?.input?.css || '';
      
      if (!scssContent) {
        console.warn(`No SCSS content found for ${filePath}`);
        return;
      }
      
      // Extract class names from compiled CSS
      const classNames = await extractClassNamesFromCompiledCSS(scssContent, filePath);
      
      // Track processed class names to avoid duplicates
      const processedClasses = new Set();
      
      // Validate each class name
      classNames.forEach(className => {
        // Skip if already processed
        if (processedClasses.has(className)) {
          return;
        }
        
        // Mark as processed
        processedClasses.add(className);
        
        const validation = validateClassName(className, pattern, type);
        
        if (!validation.valid) {
          // Find the first rule that contains this class name for reporting
          let reportNode = null;
          root.walkRules(rule => {
            if (!reportNode && rule.selector.includes(`.${className}`)) {
              reportNode = rule;
            }
          });
          
          stylelint.utils.report({
            ruleName: 'plugin/bem-flocss-scss',
            result,
            node: reportNode || root,
            message: validation.message
          });
        }
      });
    } catch (error) {
      console.warn(`Error in BEM/FLOCSS plugin for ${filePath}:`, error.message);
    }
  };
});

export default bemFlocssScss;
