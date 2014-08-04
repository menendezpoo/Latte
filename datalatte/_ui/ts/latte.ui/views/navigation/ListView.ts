module latte{
    /**
     * Renders a list with columns
     **/
    export class ListView extends View{

        /**
         *
         **/
        private _selectedItem: ListViewItem;

        /**
         * Collection of column headers of list.
         **/
        columnHeaders: Collection<ColumnHeader>;

        /**
         * Points to the DOM element where the column headers are placed.
         **/
        columnHeadersElement: JQuery;

        /**
         * Collection of items in list
         **/
        items: Collection<ListViewItem>;

        /**
         * Creates the ListView
         **/
        constructor(){


            // Initm
            super();
            this.element.addClass('list');

            // Init collections
            this.items = new Collection<ListViewItem>(this._onAddItem, this._onRemoveItem, this);
            this.columnHeaders = new Collection<ColumnHeader>(this._onAddColumn, this._onRemoveColumn, this);

            // Init elements
            this.columnHeadersElement = $('<div>').addClass('column-headers').appendTo(this.element);

            // Icon spacer for columns
            this.columnHeadersElement.append($('<div>').addClass('spacer'));


            // Test
            var lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac urna ac est ultrices adipiscing. Nulla eros justo, tristique venenatis ultricies et, congue ut orci. Donec vitae augue eros, nec pretium velit. Cras id nisl a sapien elementum mollis. Aenean augue turpis, sodales accumsan porttitor ut, sagittis quis massa. Etiam consequat, lectus ut tempor dapibus, dui lorem pharetra tellus, a luctus nunc tortor non nibh. Aliquam eros nisl, porta et consequat eleifend, rhoncus vel justo. Aliquam vel diam sit amet arcu suscipit aliquet. Morbi sed metus ut lectus condimentum interdum. Duis eu orci vel mauris luctus interdum. Proin sem lacus, dictum eget vehicula in, tempus ac felis. Mauris vitae purus nibh, et malesuada urna. Sed sit amet nunc leo, et vehicula dui.".split(' ');
            var word = function(){ return lipsum[Math.round(Math.random() * (lipsum.length - 1))]; };
            var words = function(){ var r =''; for(var i = 0; i < Math.random() * 8; i++) r+= word() + ' '; return r;  }

        }

        /**
         *
         **/
        public _informSelectedItem(item: ListViewItem){

            if(!(item instanceof ListViewItem))
                throw new InvalidArgumentEx('item');

            var changed = item !== this._selectedItem;
            this._selectedItem = item;

            if(changed) {
                this.onSelectedItemChanged();
            }
        }

        /**
         *
         **/
        private _itemSelected(item: ListViewItem){

            for(var i = 0; i < this.items.count; i++){
                if(this.items.item(i) !== item){
                    this.items.item(i).selected = false;
                }
            }


        }

        /**
         *
         **/
        private _onAddColumn(column: ColumnHeader){

            var __this = this;

            this.columnHeadersElement.append(column.element);

            // Add column to existing items
            for(var i = 0; i < this.items.count; i++){
                this.items.item(i).addColumn(column.width);
            }

            this.onLayout();

        }

        /**
         *
         **/
        private _onAddItem(item: ListViewItem){

            var __this = this;

            this.container.append(item.element);

            item.selectedChanged.add(function(){ if(this.selected) __this._itemSelected(this); })

            // Add existing columns
            for(var i = 0; i < this.columnHeaders.count; i++){
                item.addColumn(this.columnHeaders.item(i).width);
            }

            item.onLayout();

        }

        /**
         *
         **/
        private _onRemoveColumn(column: ColumnHeader){

            column.element.detach();
            this.onLayout();

        }

        /**
         *
         **/
        private _onRemoveItem(item: ListViewItem){

            item.element.detach();

        }

        //region Events

        //endregion

        //region Methods

        /**
         * Overriden. Raises the <c>layout</c> event
         **/
        onLayout(){


            super.onLayout();

            if(this.element.parent().length == 0) return;

            var i = 0;

            if(this.columnHeadersVisible){
                if(this.columnHeaders.count > 0){
                    var maxHeight = 23;

                    for(i = 0; i < this.columnHeaders.count; i++){
                        maxHeight = Math.max(maxHeight, this.columnHeaders.item(i).element.outerHeight());
                    }

                    this.columnHeadersElement.height(maxHeight);
                    this.container.css('top', maxHeight);
                }
            }else{
                this.container.css('top', 0);
            }


            for(i = 0; i < this.items.count; i++)
                this.items.item(i).onLayout();


        }
        //endregion

        //region Properties

        /**
         * Gets or sets a value indicating if the column headers are currently visible
         **/
        get columnHeadersVisible(): boolean{
            return this.columnHeadersElement.is(':visible');
        }

        /**
         * Gets or sets a value indicating if the column headers are currently visible
         **/
        set columnHeadersVisible(value: boolean){


            if(!_isBoolean(value)) throw new InvalidArgumentEx('value');

            if(value) this.columnHeadersElement.show();
            else      this.columnHeadersElement.hide();



        }

        /**
         * Gets or sets the selected item of the list
         *
         * @returns {ListViewItem}
         */
        public get selectedItem(): ListViewItem{
            return this._selectedItem;
        }

        /**
         * Gets or sets the selected item of the list
         *
         * @param {ListViewItem} value
         */
        public set selectedItem(value: ListViewItem){

            // Check if value changed
            var changed: boolean = value !== this._selectedItem;

            // Set value
            this._selectedItem = value;

            // Trigger changed event
            if(changed){
                this.onSelectedItemChanged();
            }
        }

        /**
         * Back field for event
         */
         private _selectedItemChanged: LatteEvent

        /**
         * Gets an event raised when the value of the selectedItem property changes
         *
         * @returns {LatteEvent}
         */
        public get selectedItemChanged(): LatteEvent{
            if(!this._selectedItemChanged){
                this._selectedItemChanged = new LatteEvent(this);
            }
            return this._selectedItemChanged;
        }

        /**
         * Raises the <c>selectedItem</c> event
         */
        public onSelectedItemChanged(){
            if(this._selectedItemChanged){
                this._selectedItemChanged.raise();
            }
        }
        //endregion
    }
}