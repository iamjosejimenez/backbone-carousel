import Backbone from 'backbone';
import Component from '../../component';
import template from './home.html';
import ImageView from './image/image';

const fetchImages = () => {
  return [{
    title: 'First block',
    images: [
      'https://img.clipartfest.com/f1c794050ae6208b8ef22ce9de850586_example-example_1502-889.jpeg',
      'https://thumbs.dreamstime.com/z/example-stamp-28420393.jpg'
    ]
  }, {
    title: 'Second block',
    images: [
      'http://www.addictedtoibiza.com/wp-content/uploads/2012/12/example.png',
      'https://crossfitfaith.files.wordpress.com/2011/07/example-jpg.png'
    ]
  }];
};

const Image = Backbone.Model.extend({});

const Images = Backbone.Collection.extend({
  model: Image
});

const Element = Backbone.Model.extend({});

const Carousel = Backbone.Collection.extend({
  model: Element
});

const dataToModels = (data) => {
  const elements = data.map(({ title, images }) => {
      const imagesCollection = new Images(images
        .map(image => {
          return new Image({ url: image });
        })
      );
      return new Element({
        title,
        images: imagesCollection
      });
  });
  return new Carousel({ elements });
};

export default Component.extend({
  template,
  events: {
    'click #back-button': 'previousPicture',
    'click #next-button': 'nextPicture'
  },
  renderImage: function() {
    this.image.set({
      url: this.images[this.index]
    });
    this.imageView.render();
  },
  afterRender() {
    this.updateButtons();
  },
  updateButtons: function() {
    if (this.index + 1 >= this.images.length) {
      this.$el.find('#next-button').addClass('disabled');
    } else {
      this.$el.find('#next-button').removeClass('disabled');
    }
    if (this.index) {
      this.$el.find('#back-button').removeClass('disabled');
    } else {
      this.$el.find('#back-button').addClass('disabled');
    }
  },
  previousPicture: function() {
    if (this.index - 1 >= 0) {
      this.index -= 1;
      this.updateButtons();
      this.renderImage();
    }
  },
  nextPicture: function() {
    if (this.index + 1 < this.images.length) {
      this.$el.find('#back-button').removeClass('disabled');
      this.index += 1;
      this.updateButtons();
      this.renderImage();
    }
  },
  initialize: function () {
    this.images = fetchImages()[0].images;
    const randomNumber = 1;//Math.floor(Math.random() * this.images.length);
    this.index = randomNumber;
    this.image = new Image({
      url: this.images[randomNumber]
    });
    this.imageView = new ImageView({
      model: this.image
    });
    this.setViews({
      '.carousel-image-container': this.imageView
    });
  }
});
