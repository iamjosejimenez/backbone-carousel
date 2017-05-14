import Backbone from 'backbone';
import Router from './router';
import $ from 'jquery';
// Define your master router on the application namespace and trigger all
// navigation from this instance.
const router = new Router();

// Trigger the initial route and enable HTML5 History API support, set the root
// folder to '/' by default.
Backbone.history.start({ pushState: true, root: '/' });

$(document).on("click", "a:not([data-bypass])", function(evt) {
  const href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  const root = `${location.protocol}//${location.host}${Backbone.history.options.root}`;

  if (href.prop && href.prop.slice(0, root.length) === root) {
    evt.preventDefault();
    Backbone.history.navigate(href.attr, true);
  }
});
