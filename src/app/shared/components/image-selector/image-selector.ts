import { Component, inject } from '@angular/core';
import { ImageSelectorService } from '../../services/image-selector-service';

@Component({
  selector: 'app-image-selector',
  imports: [],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private imageSelectorService = inject(ImageSelectorService);
  //above are private properties only accessible within the ImageSelector class. not in the html file.
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();
  //i dont want the showImageSelector signal to be editable in the template. i only want to read the value
  //of the signal in the template to show or hide the image selector modal,

  hideImageSelector() {
    this.imageSelectorService.hideImageSelector();
  }
}
