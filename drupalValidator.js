/**
 * @file
 * Behavior script for Custom Drupal Templates, containing logic for
 * form validation. Written by Ben Helmer.
 *
 * This is a global validation file, and should only contain logic around
 * validating and handling error-state behavior on forms in Drupal.
 *
 *
 * About the structure of this file:
 *
 *   <!> This file is split into 5 layers. Each layer only handles 1 purpose.
 *       Please try to understand this structure before implementing your logic.
 *
 * Layer:
 *
 *   1.  Element selection and binding.
 *
 *   2.  Grouping logic which will be attached to a binding in level 1.
 *       *ALL ERROR MESSAGE COPY is found here.*
 *
 *   3.  Linking a validation rule with a UI response function.
 *       Linking several validation rules together, and attaching a UI response
 *       function that the outcome of that set of rules.
 *
 *   4.  Error-handling UI logic. Any markup, html, etc lives here, and is
 *       abstracted (1 funtion for all error UI display on any field.)
 *
 *   5.  Abstract, simple, reusable rules. Think any test that only returns
 *       true or false.
 *
 *  <!>  NOTE: Layers 1 & 2 should be implemented on a per-module/form basis,
 *             and reference back to layers 3-5 within this file.
 */


(function ($) {


  Drupal.drupalValidator = Drupal.drupalValidator || {};


//  Drupal.behaviors.drupalValidator = {
//    attach: function (context, settings) {
//      // Attach logic to be executed here.


/**
 * <!> Note:
 *
 *       This level should be defined on a per-use basis. Do not add specific
 *       bindings or elements to this library.
 *       This library is meant to be reusable, and not specific to any one
 *       portion of the site.
 */

//    }
//  };




/**
 * Layer 2:
 *
 *    Bound Field Master Definitions
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *    For starters, all error message copy is defined on this level.
 *
 *    These are generally functions wrapping a group of logic for a single
 *    field's validation. These are the functions generally bound to an event
 *    listener in layer 1.
 *
 *    E.G. handleLinkedPasswordFields() is all you need to call in order to
 *    execute all password logic against the password field.
 *
 *    There are also grouped rule-sets here, such as password and user-id,
 *    which bundle together all rules that need to pass in order for a password
 *    field to be considered valid.
 *
 *    Note: The rules themselves are not defined here. They are meerly grouped
 *    together here, and passed to lower layers as callbacks.
 *
 *
 *    What you won't find here:
 *      - binding
 *      - element selectors
 *      - low-level validation rule logic.
 */

/**
 * <!> Note:
 *
 *       This level should be defined on a per-use basis, same as lay 1 above.
 *       This allows you to set different combinations of rules and error
 *       messages within the contect of the page you are validating.
 */


/**
 * Layer 3:
 *
 *    Validation -> Error State Behavior Binding.
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *    This level associates validation rules (level 5) with UI error-handling
 *    (level 4), making a single function which both performs validation, and
 *    responds with UI behavior.
 *
 *    For example,
 *
 *       An element is passed for validation. Here, it will be validated, and
 *       the result will update the element with some UI so the user knows
 *       what happened.
 *
 *    What you will not find here:
 *
 *     - There are no error messages at this level.
 *     - No specific elements/classes/etc should be defined here.
 *       (See layers 1 or 2).
 *     - No markup (HTML) is found here (see layer 4)
 *
 *
 */


  /**
   * Confirm input_element contains a valid ssn format.
   * If not, set an error on the field.
   *
   * @param {element} input_element
   *   The primary ssntin field.
   * @param {element} user_id_element
   *   The User ID element, which is used as a part of the password validation
   *   rules.
   * @param {string} error_message
   *   A message that should be displayed if validation fails. This will be displayed below the field.
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateSSNField = function (input_element, error_message, error_on_blank) {
    return Drupal.drupalValidator.bindValidationError(input_element, Drupal.drupalValidatorBasics.ssnValid($(input_element).val(), error_on_blank), error_message);
  }


  /**
   * Confirm input_element contains a valid phone format.
   * If not, set an error on the field.
   *
   * @param {element} input_element
   *   The primary phone field.
   * @param {string} error_message
   *   A message that should be displayed if validation fails. This will be displayed below the field.
   * @param {boolean} error_on_blank
   *   Should we still error if the field is blank?
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validatePhoneField = function (input_element, error_message, error_on_blank) {
    return Drupal.drupalValidator.bindValidationError(input_element, Drupal.drupalValidatorBasics.phoneValid($(input_element).val(),error_on_blank), error_message);
  }


  /**
   * Confirm input_element contains a valid email format.
   * If not, set an error on the field.
   *
   * @param {element} input_element
   *   The primary email field.
   * @param {string} error_message
   *   A message that should be displayed if validation fails. This will be displayed below the field.
   * @param {boolean} error_on_blank
   *   Should we still error if the field is blank?
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateEmailField = function (input_element, error_message, error_on_blank) {
    return Drupal.drupalValidator.bindValidationError(input_element, Drupal.drupalValidatorBasics.emailValid($(input_element).val(),error_on_blank), error_message);
  }


  /**
   * Confirm input_element passes rules set for a zip-code field.
   *
   * @param {element} input_element
   *   The primary ssntin field.
   * @param {string} error_message
   *   A message that should be displayed if validation fails. This will be displayed below the field.
   * @param {boolean} error_on_blank
   *   Should we still error if the field is blank?
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateZipField = function (input_element, error_message, error_on_blank) {
    var rules = new Array(

      // Only numeric values.
      Drupal.drupalValidatorBasics.containsOnlyNumeric($(input_element).val()),

      // Must be 5 characters.
      Drupal.drupalValidatorBasics.lengthValid($(input_element).val(), 5, 5, error_on_blank)
    );

    return Drupal.drupalValidator.bindFieldValidationArray(input_element, rules, error_message);
  }


  /**
   * Defined rules for password validation.
   *
   * This function is the definition of all password validation rules.
   *
   * @param  {element} field
   *   The field containing the password we are validating. This should be
   *   a field, not a value.
   * @param  {element} user_id_field
   *   The input containing the value of the userID. We need this for
   *   a password validation rule.
   * @param  {string} error_message
   *   The error message to display if even one of these rules fail.
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.validatePasswordField = function (input_element, user_id_element, error_message) {

    // Given an array of validators, execute each one.
    // We want to know the result of the validator.
    // Associate the result with an error message.
    var rules = new Array(
      // Must be at least 8 characters.
      Drupal.drupalValidatorBasics.lengthValid($(input_element).val(), 8, 128, true),

      // Must contain both a lower and upper case latter.
      Drupal.drupalValidatorBasics.containsLowerAndUppercase($(input_element).val()),

      // Must contain a Number
      Drupal.drupalValidatorBasics.containsNumber($(input_element).val()),

      // Cannot contain the user ID.
      Drupal.drupalValidatorBasics.doesNotContainValue($(user_id_element).val(), $(input_element).val(), false)
    );

    return Drupal.drupalValidator.bindFieldValidationArray(input_element, rules, error_message);
  }


  /**
   * Defined rules for Security Question and answer validation.
   *
   * @param  {element} field
   *   The field containing the field we are validating. This should be
   *   a field, not a value.
   * @param  {element} linked_element
   *   The input containing the value of the linked field. This should be tested
   *   to not match our input_element.
   * @param  {string} error_message
   *   The error message to display if even one of these rules fail.
   *
   */
  Drupal.drupalValidator.validateSecurityField = function (input_element, linked_element, error_message, error_on_blank) {
    var rules = new Array(
      // Length must be 3+ characters.
      Drupal.drupalValidatorBasics.lengthValid($(input_element).val(), 4, 512, error_on_blank),

      // Cannot contain the linked field's value.
      Drupal.drupalValidatorBasics.doesNotContainValue($(linked_element).val(), $(input_element).val(), error_on_blank)
    );

    return Drupal.drupalValidator.bindFieldValidationArray(input_element, rules, error_message);
  }


  /**
   * Confirm two fields match. If not, set errors
   * on the confirm field, and fail.
   *
   * @param  {element} primary_element
   *   The primary field.
   * @param  {element} confirm_field
   *   The confirmation field linked to primary field.
   * @param  {boolean} error_on_blank
   *   If FALSE, we won't error when the linked_element is empty.
   * @param  {string} error_message
   *   A message that should be displayed if validation fails. This will be displayed below the field.
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateConfirmField = function (primary_field, confirm_field, error_on_blank, error_message) {
    return Drupal.drupalValidator.bindValidationError(confirm_field, Drupal.drupalValidatorBasics.fieldsMatch(primary_field, confirm_field, error_on_blank), error_message);
  };


  /**
   * Enforce that a required field is not blank.
   *
   * @param  {element} field
   *   The field being validated.
   * @param  {string} error_message
   *   The message to display if validatio fails.
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateRequiredField = function (field, error_message) {
    return Drupal.drupalValidator.bindValidationError(field, Drupal.drupalValidatorBasics.fieldNotEmpty($(field).val()), error_message);
  }


  /**
   * Enforce that a field is required if even one field in passed list is not empty.
   *
   * @param  {element} field
   *   The field being validated.
   * @param  {array({elements})} all_fields
   *   The field list of elements which we are checking.
   * @param  {string} error_message
   *   The message to display if validatio fails.
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateRequiredOneForAllField = function(field, all_fields, error_message) {
    return Drupal.drupalValidator.bindValidationError(field, Drupal.drupalValidatorBasics.NotEmptyIfAnyFieldsNotEmpty(field, all_fields), error_message);
  }

  /**
   * Confirm input_element contains a Company ID format.
   * If not, set an error on the field.
   *
   * @param {element} input_element
   *   The company id field.
   * @param {string} error_message
   *   A message that should be displayed if validation fails. This will be displayed below the field.
   * @param {boolean} error_on_blank
   *   Should we still error if the field is blank?
   *
   * @return {boolean}
   *   TRUE if we passed. Otherwise, FALSE.
   */
  Drupal.drupalValidator.validateCompanyIdField = function (input_element, error_message, error_on_blank) {

    var rules = new Array(

        // Length must be 4 characters.
        Drupal.drupalValidatorBasics.lengthValid($(input_element).val(), 4, 4, error_on_blank),

        // Only coantins alphanumeric characters.
        Drupal.drupalValidatorBasics.containsOnlyAlphaNumeric($(input_element).val())
    );

    return Drupal.drupalValidator.bindFieldValidationArray(input_element, rules, error_message);
  }



/**
 * Layer 3.B:
 *
 *    Validation Behavior
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *    Same as above, but handling for groups of errors.
 */



  /**
   * Attach a validation function to a field.
   *
   * This attaches a validation callback to a field, and sets error_message on
   * field if the callback returns false.
   *
   * @param {element} field
   *   An input element we should attach an error to.
   * @param {function} callback
   *   A complete callback, preloaded with any parameters, which we should
   *   execute. We expect a boolean result.
   * @param {string} error_message
   *   A plain text error message, which we should set if our callback
   *   returns false.
   *
   * @return {boolean}
   *   TRUE on success. Otherwise, FALSE, which implies an error was set
   *   on the field.
   */
  Drupal.drupalValidator.bindValidationError = function (field, callback, error_message) {
    if (callback === false) {
      Drupal.drupalValidator.setErrorState(field, error_message);
      return false;
    }

    return true;
  };


  /**
   * Attach an array of validation functions to a field. Whenever all validation
   * on that field passes, the field recovers from it's error state.
   *
   * @param  {element}   field
   *   An input element we should attach an error to.
   * @param  {function} validation_callbacks
   *   An array of complete callbacks, preloaded with any parameters,
   *   which we should execute. We expect a boolean result from each callback.
   * @param {boolean|string) report_error_message
   *   If a string is passed, we assume this is a generic error message to
   *   display of any validation fails. Otherwise, we assume a boolean. If TRUE,
   *   then we will gather error messages for all validation failures, concat
   *   them, and display the sum as an error message upon failure. If FALSE,
   *   no error message will be display.
   *
   * @return {boolean}
   *   TRUE on success. Otherwise, FALSE, which implies an error was set
   *   on the field.
   */
  Drupal.drupalValidator.bindFieldValidationArray = function(field, validaton_callbacks, report_error_message) {

    var error_message = '';

    // We allow a single error message to be passed, representing one message
    // if there are any vaildation failures.
    //
    // Either way, make sure that we force report_error_message to a boolean.
    if (typeof report_error_message === 'string' || report_error_message instanceof String) {
      error_message = report_error_message;
      report_error_message = false;
    }
    else if (report_error_message !== false) {
      report_error_message = true;
    }

    // Execute all rules, and get a result, or array of errors.
    var results = Drupal.drupalValidator.runValidationRuleset(validaton_callbacks, false, true);

    // If error-free, recover error state.
    if ((report_error_message === false && results === true)) {
      Drupal.drupalValidator.recoverErrorState(field);
      return true;
    }

    if (results === false && report_error_message === false) {
      Drupal.drupalValidator.setErrorState(field, error_message);
    }

    return false;
  };


  /**
   * Evaluate a passed ruleset of validation callbacks, and assemble a result.
   *
   * The result will be a boolean true/false of the total success, or an array
   * of results, if the return_errors flag was set.
   *
   * This function DOES NOT DO ERROR HANDLING DIRECTLY. While callbacks passed
   * to this function may handle errors, this function simply executes them,
   * and does not handle error setting or recovery itself.
   *
   * @see
   *   bindFieldValidationArray(),
   *   bindFieldValidationPopup(),
   *   which call this directly.
   *
   * @param  {array(functions)} validation_callbacks
   *   An array of complete callbacks, preloaded with any parameters,
   *   which we should execute. We expect a boolean result from each callback.
   * @param  {boolean} return_errors
   *   Should we return an array of errors instead of a boolean success? This is
   *   used when a set of rule results will be assembled into a validator UI,
   *   such as the password popup validator.
   *
   * @return {boolean|array(string)}
   *   By default, a true/false will be returned, signifying if ALL RULES
   *   PASSED. If return_errors was set to TRUE, then an array of results will
   *   be returned instead.
   */
  Drupal.drupalValidator.runValidationRuleset = function (validation_callbacks, return_errors, halt_on_error) {

    var error_array = new Array();
    var errors = false;

    // Execute all callbacks, and assemble their results.
    if (Array.isArray(validation_callbacks) && validation_callbacks.length > 0) {
      for (var i = 0; i < validation_callbacks.length; i++) {
        var my_result = validation_callbacks[i];

        // If halt on false, the exit.
        if (halt_on_error === true && my_result === false) {
          return false;
        }

        error_array.push(my_result);

        // If we're not in error-returning mode, and we recieved a failure,
        // flag this ruleset as failed.
        if (return_errors !== true && my_result === false) {
          errors = true;
        }
      }
    }

    // Return the errors array if requested.
    if (return_errors === true) {
      return error_array;
    }

    // Otherwise return TRUE if no errors were detected.
    return !errors;
  };



/**
 * Layer 4:
 *
 *    Error State Functions + Markup
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *    This level has standardized error state functions to either set
 *    (or recover) from form errors. Any time you wish to do standard error
 *    state updates to the UI, you should use these functions, unless you have
 *    a special case UI.
 *
 *    Popup Validator UI (i.e. password/user ID) display logic is also included
 *    here. This is for UI assemble only, and does not contain specific rules.
 */


  /**
   * Set an error on a given element.
   *
   * This will add error classes on an element, it's label, the form,
   * and associate an error message with the field, if passed.
   *
   * @param element element
   *   The element we should set an error on. This should be a field on a form.
   * @param string message
   *   An error message to set on the field.
   */
  Drupal.drupalValidator.setErrorState = function (element, message) {

    // Add the error to the input.
    jQuery(element).addClass('error');

    var element_label = jQuery("label[for='" + jQuery(element).attr("id") + "']").closest('.form-item-label');

    // Add the error to the label.
    if (!jQuery(element_label).hasClass('error')) {
      jQuery(element_label).addClass('error');
    }

    // The closest form should be the one we're in.
    // Add an error class to the global form.
    var my_form = jQuery(element).closest('form');
    jQuery(my_form).addClass('form-error-state');


    var element_error_message = jQuery(element).closest('.form-item').siblings('.messages');

    // If one does not exist, add it.
    if (jQuery(element_error_message).length <= 0) {
      jQuery(element).closest('.form-item').after('<div class="messages error messages-inline">' + message + '</div>');
    }
    else {
      jQuery(element_error_message).html(message);
    }
  };


  /**
   * Given a field, recover that field (and the page)
   * from existing error states.
   *
   * We'll recover the passed element from the error state (UI only),
   * and the page, if no other errors were present.
   *
   * @param element element
   *   The element which triggere our event. A field.
   */
  Drupal.drupalValidator.recoverErrorState = function (element) {

    // Remove the form field error class.
    jQuery(element).removeClass('error');

    // Find the field's label, and remove it.
    jQuery("label[for='" + jQuery(element).attr("id") + "']").closest('.form-item-label').removeClass('error');

    // Determine if that was the only error on the page.
    // If so, remove the over-all error class, which should
    // reset all error notifications on the page.
    if (Drupal.drupalValidator.otherErrorsExist(element) == false) {
      jQuery(element).closest('.form-error-state').removeClass('form-error-state');
    }

    var element_error_message = jQuery(element).closest('.form-item').siblings('.messages');

    // If one does not exist, add it.
    if (element_error_message) {
      jQuery(element_error_message).html('');
    }
  };


  /**
   * Determine if there are other errors on the page besides our passed element.
   *
   * @param domElement element
   *   the element we should not count towards our error check.
   *
   * @return boolean
   *   TRUE if other errors were found on the form. Otherwise FALSE.
   */
  Drupal.drupalValidator.otherErrorsExist = function (element) {

    // The closest form should be the one we're in.
    var my_form = jQuery(element).closest('form');

    // If we're in a form, find all the fields with error classes.
    // Then, count all fields which are not our passed element.
    if (my_form) {
      var count = 0;
      var error_elements = jQuery(my_form).find('input.error');

      // Check each input with the error class.
      jQuery.each(error_elements, function (key, value) {
        if (value != element) {
          count++;
        }
      });

      // If we found error fields other than our own, our page still has errors.
      if (count > 0) {
        return true;
      }
    }
    // If we're this far, either our page doesn't have forms
    // (so we can't have errors), or our form is error-free!
    return false;
  };

})(jQuery);
