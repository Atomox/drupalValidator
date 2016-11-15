
/**
 * Layer 5:
 *
 *    Raw Validation Functions
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *    This level contains validation functions at their simplest form.
 *    These are simple true / false functions, and only accept strings as their
 *    input.
 *
 *    These functions do not handle any UI updates to the front end. Other
 *    error-handling + validation logic on level 3 should call these functions,
 *    and handle UI updates to let the user know there are errors.
 */


(function ($) {


  Drupal.drupalValidatorBasics = Drupal.drupalValidatorBasics || {};


  Drupal.behaviors.drupalValidatorBasics = {
    attach: function (context, settings) {
      // Attach logic to be executed here.
    }
  };


  /**
   * If any passed fields are not empty, but field is empty, fail.
   *
   * @param  {element} field
   *   The field being validated.
   * @param  {array({elements})} all_fields
   *   The field list of elements which we are checking.
   */
  Drupal.drupalValidatorBasics.NotEmptyIfAnyFieldsNotEmpty = function(field, all_fields) {

    // First, remove our element from the all_elements list.
    all_fields = jQuery.grep(all_fields, function(value) {
      return value != field;
    });

    // If at least one other field is set, and our field is not, fail.
    if (Drupal.drupalValidatorBasics.allFieldsEmpty(all_fields) === false) {
      if (Drupal.drupalValidatorBasics.fieldNotEmpty($(field).val()) === false) {
        return false;
      }
    }

    return true;
  }


  /**
   * Fail if any field is not empty.
   *
   * @param  {element} field
   *   The field being validated.
   * @param  {array({elements})} all_fields
   *   The field list of elements which we are checking.
   */
  Drupal.drupalValidatorBasics.allFieldsEmpty = function(all_fields) {

    var empty = true;

    // Check each field, looking for any values.
    var result = jQuery(all_fields).each(function() {
      if (Drupal.drupalValidatorBasics.fieldNotEmpty($(this).val()) === true) {
        empty = false;
        return false;
      }
    });

    return empty;
  }


  /**
   * Confirm a value is not empty.
   */
  Drupal.drupalValidatorBasics.fieldNotEmpty = function(value) {
    return Drupal.drupalValidatorBasics.lengthValid (value, 1, 999999, true);
  }


  /**
   * Confirm if fields match.
   *
   * @param  {element} primary_element
   *   The primary field.
   * @param  {element} linked_element
   *   The secondary field linked to primary field.
   * @param  {element} fail_on_blank
   *   If FALSE, we will not fail a blank field against a non-blank one.
   *
   * @return {boolean}
   *   TRUE if they match. Otherwise, FALSE.
   */
  Drupal.drupalValidatorBasics.fieldsMatch = function(field_1, field_2, fail_on_blank) {
    // We should ignore validation when the secondary field is blank, if requested.
    if (fail_on_blank === false && ($(field_1).val().length === 0 || $(field_2).val().length === 0)) {
      return true;
    }
    // Handle unmatching fields, and flag both fields.
    else if ($(field_1).val() !== $(field_2).val()) {
      return false;
    }

    return true;
  };


  /**
   * SSN valid.
   *
   * @param {string} value
   *   A string we should validate as an ssn.
   *
   * @returns {boolean}
   *   TRUE on success. Otherwise, FALSE.
   */
  Drupal.drupalValidatorBasics.ssnValid = function (value, error_on_blank) {

    var count = value.length;
    var socialRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    if (count == 0 && error_on_blank == false) {
      return true;
    }
    if ((count !== 0 && count < 9) || !socialRegex.test(value)){
      return false;
    }

    return true;
  }


  /**
   * Mail string validator
   *
   * @param {string} value
   *   A string we should validate as an email.
   *
   * @returns {boolean}
   *   TRUE on success. Otherwise, FALSE.
   */
  Drupal.drupalValidatorBasics.emailValid = function (value, error_on_blank) {

    // Don't fail on an empty field, unless we were asked to.
    if (value.length == 0 && error_on_blank == false) {
      return true;
    }

    var emailRegex = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(value);
  };


  /**
   * Phone string validation.
   *
   * @param {string} value
   *   A string we should validate as a phone number.
   *
   * @returns {boolean}
   *   TRUE on success. Otherwise, FALSE.
   */
  Drupal.drupalValidatorBasics.phoneValid = function (value, error_on_blank) {

    // Don't fail on an empty field, unless we were asked to.
    if (value.length == 0 && error_on_blank == false) {
      return true;
    }

    // Rule: 1. In the format: 111-111-1111.
    // Rule: 2. Must be 10 numbers, excluding dashes.
    // Rule: 3. cant be same digit without dashes.
    var numericRegex = /^\d{3}-?\d{3}-?\d{4}$/;
    var firstChar = value[0];
    var ruleOne = numericRegex.test(value);
    var ruleTwo = value.replace(/-/g,"").length === 10;
    var ruleThere = value.replace(/-/g,"").replace( new RegExp("^" + firstChar + "+$"), "").length !== 0;

    return ruleOne && ruleTwo && ruleThere;
  };


  /**
   * Validate a string does not contain the same character twice in a succession.
   *
   * E.G. aabcddefe
   *
   *   contains a and d in succession, while e ppear twice, but not in succession.
   */
  Drupal.drupalValidatorBasics.doesNotContainDoubleCharacters = function(value) {
    var moreThanTwoReps = /(.)\1\1/;
    return !moreThanTwoReps.test(value);
  }

  Drupal.drupalValidatorBasics.doesNotContainValue = function(needle, haystack, error_on_blank) {
    if (needle.length == 0 && !error_on_blank) {
      return true;
    }
    if (haystack.indexOf(needle) === -1) {
      return true;
    }
    return false;
  }

  Drupal.drupalValidatorBasics.containsSpecialCharacters = function(value) {
    var atLeastOneCap = /[0-9!@?]+/;
    return atLeastOneCap.test(value);
  };

  Drupal.drupalValidatorBasics.containsUppercase = function(value) {
    var atLeastOneCap = /[A-Z]+/;
    return atLeastOneCap.test(value);
  };

  Drupal.drupalValidatorBasics.containsLowercase = function(value) {
    var atLeastOneLower = /[a-z]+/;
    return atLeastOneLower.test(value);
  };

  Drupal.drupalValidatorBasics.containsNumber = function (value) {
    var numeric = /[0-9]+/;
    return numeric.test(value);
  }

  /**
   * Test for only alpha or numeric characters.
   */
  Drupal.drupalValidatorBasics.containsOnlyAlphaNumeric = function (value) {
    var alphaNumeric = /[^0-9a-zA-Z]+/;
    return !alphaNumeric.test(value);
  }

  /**
   * Test for only numeric characters.
   */
  Drupal.drupalValidatorBasics.containsOnlyNumeric = function (value) {
    var numeric = /[^0-9]+/;
    return !numeric.test(value);
  }

  Drupal.drupalValidatorBasics.containsAtLeastOneAlpha = function (value) {
    return (Drupal.drupalValidatorBasics.containsUppercase(value) || Drupal.drupalValidatorBasics.containsLowercase(value));
  }

  Drupal.drupalValidatorBasics.containsLowerAndUppercase = function (value) {
    return (Drupal.drupalValidatorBasics.containsUppercase(value) && Drupal.drupalValidatorBasics.containsLowercase(value));
  };

  Drupal.drupalValidatorBasics.lengthValid = function(value, min, max, fail_on_blank) {
    if (min === undefined && max === undefined) {
      return true;
    }
    else if (!fail_on_blank && value.length == 0) {
      return true;
    }
    else if (min === undefined && value.length > max) {
      return false;
    }
    else if (max === undefined && value.length < min) {
      return false;
    }
    if (value.length < min || value.length > max) {
      return false;
    }

    return true;
  }


/**
 * Layer 6:
 *
 *    Bahavior Replacement Functions
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *    Reusable functionality that manipulates the values of fields.
 */

  /**
   * Auto-format a field to allow only numeric characters, removing everything
   * else as a user types.
   *
   * @param  {element} element
   *   The field element we are applying this behavior to.
   */
  Drupal.drupalValidatorBasics.NumericOnlyAutoFormatBehavior = function (element) {
    // Replace all non-numeric characters.
    element.value = element.value.replace(/\D/g,'');
  }

})(jQuery);
