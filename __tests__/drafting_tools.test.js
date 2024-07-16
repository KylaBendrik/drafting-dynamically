const {
    formatLength, 
    drawPoint, 
    drawGuide, 
    drawLine, 
    findIntersectionPoint, 
    definePoint
  } = require('./drafting_toolsjs');

  describe('formatLength', () => {
    test('returns a string of a whole number', () => {
      expect(formatLength(1)).toBe('0');
    });
    
  });