/**
 *  Expose `Template`.
 */

module.exports = Template;

/**
 * Template.
 *
 * @param {String} name
 */
function Template(name) {
  this.name = name;
}

/**
 * Provides the answer to the ultimate question 
 * of life, the universe and everything.
 */

Template.prototype.getAnswer = function () {
  return 42;
};
