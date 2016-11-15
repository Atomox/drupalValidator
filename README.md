# drupalValidator
JS field validation library for Drupal 7

Written by Ben Helmer

Standard front end JS validation of Drupal fields, including ability to set/recover field error states on the front end in the same manor as the Form API sets them.

This is not a plugin, but a library. You must impliment layers 1 & 2, selecting binding fields, then linking them to one of the pre defined functions.




# Layered Structure
This file is split into 5 layers. Each layer only handles 1 purpose.
*Please try to understand this structure before implementing your logic.*

Layer:Layer:
 1.  Element selection and binding.
 
 2.  Grouping logic which will be attached to a binding in level 1. *ALL ERROR MESSAGE COPY is found here.*
 
 3.  Linking a validation rule with a UI response function. Linking several validation rules together, and attaching a UI response function that the outcome of that set of rules.
 
 4.  Error-handling UI logic. Any markup, html, etc lives here, and is abstracted (1 funtion for all error UI display on any field.)
 
 5.  Abstract, simple, reusable rules. Think any test that only returns true or false.
 
 <!>  NOTE: Layers 1 & 2 should be implemented on a per-module/form basis, and reference back to layers 3-5 within this file.
