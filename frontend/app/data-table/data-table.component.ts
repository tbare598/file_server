import { Component, OnInit, Input } from '@angular/core';

import { DataTableModel } from './data-table';
import { DataTableRowModel, DataTableCellModel } from './data-table';

@Component({
    selector: 'data-table',
    templateUrl: 'app/data-table/data-table.component.html',
    styleUrls: ['app/data-table/data-table.component.css']
})

export class DataTableComponent implements OnInit {

    @Input() dataTable: DataTableModel;
    
    private initWidth: number;
    private searchTerm: string;
    private pageNumber: number;
    private totalNumOfResults: number;
    private maxNumOfResults: number;
    private lowerLimit: number;
    private upperLimit: number;
    //private counter = 0;
    private sortedColumnIndex = -1;
    private sortCompRetVal = -1;
    //private prevDataTable: string;
    
    constructor() {
      this.initWidth = window.innerWidth;
    }
    

    ngOnInit() {
      this.searchTerm = '';
      this.pageNumber = 1;
      this.totalNumOfResults = 0;
      this.maxNumOfResults = 10;
    }
    
    changePage(newPage: string) {
      let newPageNum = parseInt(newPage, 10);
      if (!isNaN(newPageNum)
      && newPageNum > 0
      && newPageNum <= this.numOfPages) {
        this.pageNumber = newPageNum;
      }
    }
    
    get numOfPages(): number{
      return Math.ceil(this.totalNumOfResults / this.maxNumOfResults);
    }
    
    //TODO: STOP THIS FROM BEING CALLED ALL THE TIME
    headerCellCssClasses(cell: DataTableCellModel) {
      let headerRow = this.dataTable.headerRow;
      
      return {
        sorting:      headerRow.sortCol !== cell.id,
        sorting_asc:  headerRow.sortCol === cell.id && headerRow.sortDir === 'asc',
        sorting_desc: headerRow.sortCol === cell.id && headerRow.sortDir === 'desc'
      };
    }
    
    getPageRange() {
      if (this.totalNumOfResults <= 0) {
        return [];
      }
      let arr = [];
      if (this.numOfPages <= 7) {
        for (let i = 1; i < this.numOfPages + 1; i++) {
          arr.push(i.toString());
        }
      //More than 7, so pageNumber matters
      } else {
        //One ellipses at the end
        if (this.pageNumber <= 4) {
          for (let i = 1; i <= 5; i++) {
            arr.push(i.toString());
          }
          arr.push('…');
          arr.push(this.numOfPages.toString());
        //One ellipses at the beginning
        }else if (this.numOfPages - this.pageNumber <= 3) {
          arr = [ '1', '…' ];
          for (let i = this.pageNumber - 1; i <= this.numOfPages; i++) {
            arr.push(i.toString());
          }
        //else two ellipses
        } else {
          arr = [
            '1',
            '…',
            (this.pageNumber - 1).toString(),
            this.pageNumber.toString(),
            (this.pageNumber + 1).toString(),
            '…',
            this.numOfPages.toString()
          ];
        }
      }
      return arr;
    }
    
    getPaginationInfo() {
      this.lowerLimit = 1 + (this.pageNumber - 1) * this.maxNumOfResults;
      if (this.lowerLimit > this.totalNumOfResults) {
        this.lowerLimit = this.totalNumOfResults;
      }
      
      this.upperLimit = this.pageNumber * this.maxNumOfResults;
      if (this.upperLimit > this.totalNumOfResults) {
        this.upperLimit = this.totalNumOfResults;
      }
        
      return 'Showing ' + this.lowerLimit + ' to ' + this.upperLimit + ' of ' + this.totalNumOfResults + ' entries';
    }
    
    getRows(): DataTableRowModel[] {
      let dataRows: DataTableRowModel[] = [];
      if (!this.dataTable || !this.dataTable.dataRows) {
        return dataRows;
      }
      //Using normal for loop, to keep references
      for (let i1 = 0; i1 < this.dataTable.dataRows.length; i1++) {
        let row = this.dataTable.dataRows[i1];
        let rowFound = false;
        
        for (let i2 = 0; i2 < row.cells.length; i2++) {
          let cell = row.cells[i2];
          
          for (let i3 = 0; i3 < cell.items.length; i3++) {
            let item = cell.items[i3];
            if (item.text.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
              rowFound = true;
            }
          }
        }
        if (rowFound) {
          dataRows.push(row);
        }
      }
      //store this so we don't have to reevaluate this function to get the value
      this.totalNumOfResults = dataRows.length;
      return this.sortRows(dataRows);
    }
    
    sortByCol(colId: string) {
      let currDir = this.dataTable.headerRow.sortDir;
      let currCol = this.dataTable.headerRow.sortCol;
      let newDir = 'asc';
      if (currCol === colId && currDir !== 'desc') {
        newDir = 'desc';
      }
      
      this.dataTable.headerRow.sortDir = newDir;
      this.dataTable.headerRow.sortCol = colId;
    }
    
    private sortRows(dataRows: DataTableRowModel[]): DataTableRowModel[] {
      let col = this.dataTable.headerRow.sortCol;
      let dir = this.dataTable.headerRow.sortDir;
      let headerCells = this.dataTable.headerRow.cells;
      
      for (let i = 0; i < headerCells.length; i++) {
        if (headerCells[i].id === col) {
          this.sortedColumnIndex = i;
          break;
        }
      }
      
      this.sortCompRetVal = -1;
      if (dir === 'desc') {
        this.sortCompRetVal = 1;
      }
      
      
      return dataRows.sort(this.itemCompare(this));
    }
    
    private itemCompare(context) {
      return (rowA, rowB) => {
        let val1 = rowA.cells[context.sortedColumnIndex].items[0].text;
        let val2 = rowB.cells[context.sortedColumnIndex].items[0].text;
        if (!isNaN(val1) && !isNaN(val2)) {
          val1 = parseFloat(val1);
          val2 = parseFloat(val2);
        }
        if (val1 < val2) {
          return context.sortCompRetVal;
        }
        if (val1 > val2) {
          return (-1) * context.sortCompRetVal;
        }
        return 0;
      };
    }
}
