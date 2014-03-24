jquery-autocomplete
===================

RETIRING THIS PROJECT
---------------------

I'm seriously considering retiring this project. A serious rewrite would be needed to get this up to my current programming standards, and I don't have the time for that. Also, I find myself using the excellent Select2 (http://ivaynberg.github.io/select2/) these days most of the time instead of jquery-autocomplete.


What is it?
-----------

Transforms an INPUT element into an autocompleter. The autocompleter helps the user pick a value value from a list by showing available values based on keyboard input.

Supports local (JavaScript object) and remote data sets. Remote data sets can be delivered as plain text or JSON.

Works out of the box, but highly configurable using options and callback hooks.


Usage
-----

To get started, copy the files from the src/ folder to your project, and link your HTML to it. Like this:

``` html
<link rel="stylesheet" type="text/css" href="PATH_TO_SRC/jquery.autocomplete.css">
<script src="PATH_TO_JQUERY/jquery.min.js" type="text/javascript"></script>
<script src="PATH_TO_SRC/jquery.autocomplete.js" type="text/javascript"></script>

<script type="text/javascript">
    $("#input").autocomplete("/path/to/backend.php");
</script>
```

For more info refer to the docs (doc/jquery.autocomplete.txt).


Dependencies
------------

The only requirement for jquery-autocomplete is jQuery. No other plugins are required.


Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/dyve/jquery-autocomplete/issues


Twitter account
---------------

Keep up to date on announcements and more by following jquery-autocomplete on Twitter, <a href="http://twitter.com/jqautocomplete">@jqautocomplete</a>.


Author
------

**Dylan Verheul**

+ http://twitter.com/dyve
+ http://github.com/dyve


Contributors
------------

**Allart Kooiman**
**François Schiettecatte**


Copyright and license
---------------------

See LICENSE.txt file.
