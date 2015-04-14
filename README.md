# stackla-wordpress-plugin
## Changelog 2015-04-14
### What's done so far

* WP settings page with database linkage
* Custom WP metabox showing on chosen post types
* Dynamic UI written in React JS that allows the user to add as many terms or filters as they like
* Data consolidation of these UI elements into a single object to POST back to WP for validation
* Basic validation WP side for this object

### What's next

* Display of errors inside the metabox UI for instant feedback on invalid fields
* Saving of widget data from the UI into the WP database (to be stored in the wp_postmeta table)
* Rendering of the UI in an *initial state* according to the widget's saved data
* Implementation of a shortcode to render the stackla widget on the front end view of the post type