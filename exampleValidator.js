/**
* @file
*   This is an example of implimenting a validator instance of the
*   drupalValidator.
*
*   Note how you find and bind the fields on Level 1, and then bind those events
*   to error messages on level 2.
*/

(function ($) {

  Drupal.drupalValidator = Drupal.drupalValidator || {};

  // Level 1:
  //
  // Bind fields to logic functions here.
  //
  //
  Drupal.behaviors.drupalValidator = {
    attach: function (context, settings) {

      // Define element variables here from your custom form/page.
      var email = jQuery("#edit-email-address, #edit-another-email-address"),
          ssn_field = jQuery("#edit-personal-id"),
          zip = jQuery(".field-zip"),
          phone = jQuery("#edit-office-phone, #edit-cell-phone"),
          address = jQuery("#edit-address, #edit-city, #edit-state"),
          names = jQuery("#edit-first-name, #edit-last-name"),
          start_date = jQuery("#edit-start-date"),
          end_date = jQuery("#edit-end-date");


      //
      // Bind logic to definied element variables here.
      //

      // First and last name fields.
      name.on('focus', function() {
        Drupal.drupalValidator.recoverErrorState($(this));
      });
      name.on('blur', function() {
        Drupal.drupalValidator.handleRequiredField(this);
      });


      // Date fields.
      start_date.on('focus', function() {
        Drupal.drupalValidator.recoverErrorState($(this));
      });
      start_date.on('blur', function() {
        Drupal.drupalValidator.handleRequiredField(this);
      });


      // Validate a seocial security number is the proper format,
      // and is required. Recover an error field when a user clicks
      // back into the field. Obviously not ideal if the field is auto-focus.
      ssn_field.on('focus', function() {
        Drupal.drupalValidator.recoverErrorState(this);
      });
      ssn_field.on('keyup', function() {
        Drupal.drupalValidatorBasics.NumericOnlyAutoFormatBehavior(this);
      });
      ssn_field.on('blur', function() {
        Drupal.drupalValidator.handleSSNField(this, false);
      });


      // Validate a user's email.
      email.on('focus', function() {
        Drupal.drupalValidator.recoverErrorState(this);
      });
      email.on('blur', function() {
        Drupal.drupalValidator.handleEmailField(this, false);
      });


      // Zip Code validation.
      zip.on('focus', function() {
        Drupal.drupalValidator.recoverErrorState(this);
      });
      zip.on('blur', function() {
        Drupal.drupalValidator.handleZipField(this, false, true);
      });


      // Phone validation.
      phone.on('focus', function() {
        Drupal.drupalValidator.recoverErrorState(this);
      });
      phone.on('blur', function() {
        Drupal.drupalValidator.handlePhoneField(this, false);
      });
    }
  };



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
   * Validate a Social Security field, & set an error on the field if it fails.
   *
   * @param  {element} element
   *   The input element we are validating.
   *
   * @return {boolean}
   *   TRUE on success. Otherwise, FALSE.
   */
  Drupal.drupalValidator.handleSSNField = function(element, error_on_blank) {
    return Drupal.drupalValidator.bindFieldValidationArray(element, [
      Drupal.drupalValidator.validateSSNField(element, 'You entered the incorrect format', error_on_blank)
    ], true);
  }


  /**
   * Execute rules for zip code validation.
   *
   * @param  {element} field
   *   The field containing the password we are validating. This should be
   *   a field, not a value.
   * @param {element} error_on_blank
   *   Should we fail empty fields?
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.handleZipField = function (field, error_on_blank, required) {
    var validation_array = [
      Drupal.drupalValidator.validateZipField(field, 'Incorrect Format', error_on_blank)
    ];

    if (required === true) {
      // Error if field should be required/error on front end.
      // This will only display if previous error validation did not fail.
      validation_array.push(Drupal.drupalValidator.validateRequiredField(field, 'This field is required'));
    }

    return Drupal.drupalValidator.bindFieldValidationArray(field, validation_array, true);
  }


  /**
   * Execute rules for required field validation.
   *
   * @param  {element} field
   *   The field that should be required. This should be
   *   a field, not a value.
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.handleRequiredField = function (field) {
    return Drupal.drupalValidator.validateRequiredField(field, 'Field is required');
  }


  /**
   * Execute rules for required all-for-one field validation.
   *
   * An all-for-one field requires that if a group of fields have started being
   * failled out, then the passed field will be required.
   *
   * @param  {element} field
   *   The field that should be required. This should be
   *   a field, not a value.
   * @param  {array({elements})} all_fields
   *   The field list of elements which we are checking.
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.handleRequiredOneForAllField = function (field, all_fields) {
    return Drupal.drupalValidator.validateRequiredOneForAllField(field, all_fields, 'Required to complete address');
  }


  /**
   * Zip validation, but with all-for-one field rules.
   *
   * An all-for-one field requires that if a group of fields have started being
   * failled out, then the passed field will be required.
   *
   * @param  {element} field
   *   The field that should be required. This should be
   *   a field, not a value.
   * @param  {array({elements})} all_fields
   *   The field list of elements which we are checking.
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.handleZipAllForOneField = function (field, all_fields) {
    var validation_array = [
      Drupal.drupalValidator.validateZipField(field, 'Incorrect Format', false),

      // Error if field should be required/error on front end.
      // This will only display if previous error validation did not fail.
      Drupal.drupalValidator.validateRequiredOneForAllField(field, all_fields, 'Required to complete address')
    ]

    return Drupal.drupalValidator.bindFieldValidationArray(field, validation_array, true);
  }


  /**
   * Execute rules for phone number validation.
   *
   * @param {element} field
   *   The field containing the phone number we are validating. This should be
   *   a field, not a value.
   * @param {element} error_on_blank
   *   Should we fail empty fields?
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.handlePhoneField = function (field, error_on_blank, required) {
    var validation_array = [
      Drupal.drupalValidator.validatePhoneField(field, 'Incorrect Format', error_on_blank)
    ];

    if (required === true) {
      // Error if field should be required/error on front end.
      // This will only display if previous error validation did not fail.
      validation_array.push(Drupal.drupalValidator.validateRequiredField(field, 'Field is required'));
    }

    return Drupal.drupalValidator.bindFieldValidationArray(field, validation_array, true);
  }


  /**
   * Execute rules for phone number validation.
   *
   * @param {element} field
   *   The field containing the phone number we are validating. This should be
   *   a field, not a value.
   * @param {element} error_on_blank
   *   Should we fail empty fields?
   *
   * @return {boolean}
   *   The result of the validation.
   */
  Drupal.drupalValidator.handleEmailField = function (field, error_on_blank) {
    var error_message = 'Incorrect Format';
    return Drupal.drupalValidator.bindFieldValidationArray(field, [
      Drupal.drupalValidator.validateEmailField(field, 'Incorrect Format', error_on_blank),

      // Error if field should be required/error on front end.
      // This will only display if previous error validation did not fail.
      Drupal.drupalValidator.validateRequiredField(field, 'Field is required')
    ], true);
  }

})(jQuery);