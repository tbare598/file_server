export class DataTableCellItemModel {

    id: string;
    text: string;
    type: string;
    value: any;
    // ONCLICK?
    cssClass: string;

    constructor(initId = '', initText = '', initType = 'text', initValue = {}, initCssClass = '') {
      this.id = initId;
      this.text = initText;
      this.value = initValue;
      this.type = initType;
      this.cssClass = initCssClass;
    }
}
