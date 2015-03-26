jquery-autocomplete
===================

NOTE: THIS PROJECT IS RETIRED / ABANDONED
-----------------------------------------

The time has come to retire this project. The code is not up to my current programming standards, and I don't feel motivated enought to go through another rewrite. There is also not much need, because of excellent alternatives like Select2 (http://ivaynberg.github.io/select2/) and the various jQuery autocomplete efforts that have evolved from or parrallel to my original (just google jquery autocomplete).

This means that current and future bugs probably won't be fixed, unless the project finds a new caretaker. Contact me if you are interested in that role.

I'm immensely proud that this autocompleter has served the web as long as it has. It's found is way into all kinds of projects and web sites (including Barack Obama's campaign and several Mozilla projects). Thank you all!

Dylan Verheul
http://dyve.net


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
