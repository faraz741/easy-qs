import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    //searchTerm = searchTerm.toLowerCase();

    return value.filter(item => {
      // Modify the condition based on your data structure
      return item.price && item.price.toString().includes(searchTerm) || item.name && item.name.toLowerCase().includes(searchTerm)
        || item.id && item.id.toString().includes(searchTerm) || item.item_name && item.item_name.toLowerCase().includes(searchTerm)

    });
  }

}
