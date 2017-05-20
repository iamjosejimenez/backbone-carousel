import Backbone from 'backbone';
import Component from '../../component';
import template from './home.html';
import ImageView from './image/image';
import fetchImages from '../../services/images';

const BACK_PICTURE_BUTTON = 'back-picture-button';
const NEXT_PICTURE_BUTTON = 'next-picture-button';
const BACK_GALLERY_BUTTON = 'back-gallery-button';
const NEXT_GALLERY_BUTTON = 'next-gallery-button';

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

const events = {};
events[`click #${ NEXT_PICTURE_BUTTON }`] = 'nextPicture';
events[`click #${ BACK_PICTURE_BUTTON }`] = 'previousPicture';
events[`click #${ NEXT_GALLERY_BUTTON }`] = 'nextGallery';
events[`click #${ BACK_GALLERY_BUTTON }`] = 'previousGallery';

export default Component.extend({
  template,
  events: events,
  renderImage: function() {
    this.image.set({
      url: this.images[this.pictureIndex]
    });
    this.imageView.render();
  },
  afterRender() {
    this.updateButtons();
  },
  updateButtons: function() {
    if (this.pictureIndex + 1 >= this.images.length) {
      this.$el.find(`#${NEXT_PICTURE_BUTTON}`).addClass('disabled');
    } else {
      this.$el.find(`#${NEXT_PICTURE_BUTTON}`).removeClass('disabled');
    }
    if (this.pictureIndex) {
      this.$el.find(`#${BACK_PICTURE_BUTTON}`).removeClass('disabled');
    } else {
      this.$el.find(`#${BACK_PICTURE_BUTTON}`).addClass('disabled');
    }
    if (this.galleryIndex + 1 >= this.galleries.length) {
      this.$el.find(`#${NEXT_GALLERY_BUTTON}`).addClass('disabled');
    } else {
      this.$el.find(`#${NEXT_GALLERY_BUTTON}`).removeClass('disabled');
    }
    if (this.galleryIndex) {
      this.$el.find(`#${BACK_GALLERY_BUTTON}`).removeClass('disabled');
    } else {
      this.$el.find(`#${BACK_GALLERY_BUTTON}`).addClass('disabled');
    }
  },
  previousPicture: function() {
    if (this.pictureIndex - 1 >= 0) {
      this.pictureIndex -= 1;
      this.updateButtons();
      this.renderImage();
    }
  },
  nextPicture: function() {
    if (this.pictureIndex + 1 < this.images.length) {
      this.pictureIndex += 1;
      this.updateButtons();
      this.renderImage();
    }
  },
  previousGallery: function() {
    if (this.galleryIndex - 1 >= 0) {
      this.galleryIndex -= 1;
      this.setRandomImage();
      this.updateButtons();
      this.renderImage();
      this.render();
    }
  },
  nextGallery: function() {
    if (this.galleryIndex + 1 < this.galleries.length) {
      this.galleryIndex += 1;
      this.setRandomImage();
      this.updateButtons();
      this.renderImage();
      this.render();
    }
  },
  setRandomImage() {
    this.images = this.galleries[this.galleryIndex].images;
    const randomNumber = Math.floor(
      Math.random() * this.images.length
    );
    this.pictureIndex = randomNumber;
  },
  initialize: function () {
    this.galleries = fetchImages();

    let randomNumber = Math.floor(Math.random() * this.galleries.length);
    this.galleryIndex = randomNumber;

    this.setRandomImage();

    this.image = new Image({
      url: this.images[this.pictureIndex]
    });

    this.imageView = new ImageView({
      model: this.image
    });

    this.setViews({
      '.carousel-image-container': this.imageView
    });
  },
  serialize() {
    return {
      title: this.galleries[this.galleryIndex].title.toUpperCase()
    };
  }
});
