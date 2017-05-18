import Backbone from 'backbone';
import template from './image.html';
import Component from '../../../component';

export default Component.extend({
  template,
  serialize: function() {
    return {
      url: this.model.get('url'),
    };
  },
  manage: true
});
