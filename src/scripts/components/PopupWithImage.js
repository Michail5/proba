import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
   constructor(selector) {
     super(selector);
     this._popupImageImage = this._popup.querySelector('.popup-image__image');
    this._popupImageCaption = this._popup.querySelector('.popup-image__caption');
   }

  open( {src, alt} ) {
    super.open();
    this._popupImage = this._popup;
    this._popupImage.src = src;
    this._popupImage.textContent = alt;
    this._popupImage.alt = alt;
  }
}