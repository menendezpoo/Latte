module latte{
    /**
     * Presents a method for choosing options from a combobox.
     Combo options are presented as the button's items.
     The button's items tag value is assumed to be the value of the combobox.
     **/
    export class RadioGroup extends ValueItem{

        /**
         *
         **/
        private _options: any;

        /**
         *
         **/
        private _value: any;

        /**
         *
         */
        private _radios: Collection<RadioItem>;

        /**
         *
         */
        private stack: ItemStack;

        /**
         * Creates t
         **/
        constructor(options: any = null){

            super();
            this.element.addClass('radio-group');

            this.stack = new ItemStack();
            this.stack.element.appendTo(this.element);

            if(options){
                this.options = options;
            }
        }

        /**
         * Gets or sets the options of the combo
         **/
        get options(): any{
            return this._options;
        }

        /**
         * Gets or sets the options of the combo
         **/
        set options(options: any){


            if(!_isArray(options) && !_isObject(options))
                throw new InvalidArgumentEx('options', options);

            for(var i in options){

                ((name: any, option: any) => {

                    // Create radio
                    var r = new RadioItem();
                    r.text = option.toString();
                    r.tag = name;

                    this.radios.add(r);

                })(i, options[i]);

            }

            this._options = options;


        }

        /**
         * Gets the collection of radio items
         *
         * @returns {Collection<RadioItem>}
         */
        get radios(): Collection<RadioItem>{
            if(!this._radios){
                this._radios = new Collection<RadioItem>(
                    (radio: RadioItem) => {

                        // Add radio button
                        this.stack.items.add(radio);

                        // React to selection, unselect other radios
                        radio.valueChanged.add(() => {
                            if(radio.value){
                                this.value = radio.tag;
                                for(var i = 0; i < this.radios.length; i++){
                                    if(this.radios[i] !== radio){
                                        this.radios[i].value = false;
                                    }
                                }
                            }
                        });
                    },
                    (radio: RadioItem) => { this.stack.items.remove(radio) },
                    this
                );
            }
            return this._radios;
        }

        /**
         * Gets or sets the selected value of the combo
         **/
        get value(): any{
            return this._value;
        }

        /**
         * Gets or sets the selected value of the combo
         **/
        set value(value: any){


            var changed = this._value !== value;

            for(var i = 0; i < this.radios.length; i++){
                if(this.radios[i].tag == value){
                    this.radios[i].value = true;
                }
            }

            this._value = value;

            if(changed){
                this.onValueChanged();
            }

        }

        /**
         * Gets the value as a string for human reading
         **/
        get valueString(): any{

            for(var i = 0; i < this.radios.length; i++){
                if(this.radios[i].tag == this.value){
                    return this.radios[i].text;
                }
            }

            return '';

        }
    }
}