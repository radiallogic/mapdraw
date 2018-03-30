import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import {
        ADD_BOOKING,
        ADD_BOOKING_ITEM,
        CALCULATE,
        saveBookingItemElement,
        saveBookingElement,
        saveItemDetails,
        calculate,
        deleteBookingItem,
        addBooking,
        fetchLimitedList,
        fetchLimitedCruiseList
} from '../actions/actions.jsx'

import {
        ConfirmModal 
} from './modal.jsx'

class SelectOptions extends React.Component {
        constructor(props) {
                super(props);
        }

    render(){
        var options = Object.entries(this.props.options).map(function(option){
                return <option key={option[0]} value={option[0]}>{option[1]}</option>
        } ,this)



      return (
                {options}
      )
    }
}

class DateInput extends React.Component {
        constructor(props) {
                super(props);
                this.state = {

                };

                //this.state[this.props.name] = this.props[this.props.name];
        }

    render(){
      return (
                <input type="text"
                    value={this.props.value} onChange={this.props.handleChange} onBlur={this.props.handleBlur}
                    placeholder={this.props.placeholder}
                    data-format="d-M-y"
                    className="form-control"
                    name={this.props.name}
                />
      )
    }
}

class Calendar extends React.Component {
        constructor(props) {
                super(props);
                this.state = {

                };

                //this.state[this.props.name] = this.props[this.props.name]

        }


    componentDidMount() {
        // Use ReactDOM to find input in component and init datepicker on its parent
        setDatePicker.init( $(ReactDOM.findDOMNode(this.refs.dateref)).parent(), false);
    }

    render(){
      return (
           <DateInput ref="dateref"
             name={this.props.name}
             handleChange={this.props.handleChange}
             handleBlur={this.props.handleBlur}
             value={this.props.value}
             placeholder={this.props.placeholder}
             />
      )
        }
}

class CruiseDetails extends React.Component {
        constructor(props) {
                super(props);
                this.state = {

                };

                // there won't always be a bookingitemdetail row
                if( this.props.itemDetails[this.props.bookingitem_id] ){
                        var data = this.props.itemDetails[this.props.bookingitem_id]

                }else{
                        var data = [];
                }

                //console.log(' DATA  ');
                //console.log( data );

                this.state.operator_id = data.operator_id;
                this.state.vessel_id = data.vessel_id;
                this.state.itinerary_id = data.itinerary_id;
                this.state.cabintype_id = data.cabintype_id;
                this.state.cabin_number = data.cabin_number;
                this.state.extra_information = data.extra_information;

                this.handleBlur = this.handleBlur.bind(this);
                this.handleChange = this.handleChange.bind(this);
                this.handleLimitCruiseList = this.handleLimitCruiseList.bind(this);
                this.limitedCruiseList = this.limitedCruiseList.bind(this);
                this.saveIfOneDetails = this.saveIfOneDetails.bind(this);
                
                this.state.operator_options = this.props.operator_options;
                this.state.vessel_options = this.props.vessel_options;
                this.state.cabintype_options = this.props.cabintype_options;
                this.state.itinerary_options = this.props.itinerary_options;

        }

        componentDidMount() {
                var event = { target:{} }
                
                if( this.state.operator_id != null ){
                        event.target.name = 'operator_id'
                        event.target.value = this.state.operator_id
                        this.limitedCruiseList(event);
                }
                if( this.state.vessel_id != null ){
                        event.target.name = 'vessel_id'
                        event.target.value = this.state.vessel_id
                        this.limitedCruiseList(event);
                }
                if( this.state.itinerary_id != null ){
                        event.target.name = 'itinerary_id'
                        event.target.value = this.state.itinerary_id
                        this.limitedCruiseList(event);
                }
                if( this.state.cabintype_id != null ){
                        event.target.name = 'cabintype_id'
                        event.target.value = this.state.cabintype_id
                        this.limitedCruiseList(event);
                } 
        }
        
        componentWillReceiveProps(){
                var id = 0;

                if(this.props.data){
                        id = this.props.data.id
                }
                
                if( this.props.limitedCruiseFormOptions[id] !== undefined ){
                        var lcfo = this.props.limitedCruiseFormOptions[id]; 

                        this.state.operator_options = lcfo.cruise_operator;
                        this.state.vessel_options = lcfo.vessel_name;
                        this.state.cabintype_options = lcfo.cabin_type;
                        this.state.itinerary_options = lcfo.voyage_itinerary;
                        
                        this.saveIfOneDetails('operator_id', lcfo.cruise_operator);
                        this.saveIfOneDetails('vessel_id', lcfo.vessel_name);
                        this.saveIfOneDetails('cabintype_id', lcfo.cabin_type);
                        this.saveIfOneDetails('itinerary_id', lcfo.voyage_itinerary);
                        
                }else{
                        this.state.operator_options = this.props.operator_options;
                        this.state.vessel_options = this.props.vessel_options;
                        this.state.cabintype_options = this.props.cabintype_options;
                        this.state.itinerary_options = this.props.itinerary_options;
                }                 

        }
        
        saveIfOneDetails(id, object) {
                console.log( 'saveIfOne' )
                
                var values = Object.values( object );
                if( values.length == 1 ) {
                        console.log( 'saveIfOneDetails' ) 
                        this.props.saveItemDetails(id, values[0], this.props.bookingitem_id, bookingitemdetail_id );
                }
        }
            
        handleChange(event) {
                this.setState( {[event.target.name]: event.target.value} );
        }

        handleBlur(event) {
                //console.log( 'this.props.itemDetails' );
                //console.log( this.props.itemDetails );
                //console.log( 'this.props.bookingitem_id' )
                //console.log( this.props.bookingitem_id )

                if( this.props.itemDetails[this.props.bookingitem_id] == null){
                        var bookingitemdetail_id = null
                }else{
                        var bookingitemdetail_id = this.props.itemDetails[this.props.bookingitem_id].id
                }

                this.props.saveItemDetails(event.target.name, event.target.value, this.props.bookingitem_id, bookingitemdetail_id );

            }

        handleLimitCruiseList(event){
                this.setState( {[event.target.name]: event.target.value} );
                this.handleBlur(event);
                this.limitedCruiseList(event);
        }
            
        limitedCruiseList(event){
                if( this.props.itemDetails[this.props.bookingitem_id] == null){
                        var bookingitemdetail_id = null
                }else{
                        var bookingitemdetail_id = this.props.itemDetails[this.props.bookingitem_id].id
                }
                
                this.props.fetchLimitedCruiseList(event.target.name, event.target.value, bookingitemdetail_id);
        }

        render() {


                var operator_options =
                Object.entries(this.state.operator_options).map(function(option){
                    return <option key={option[0]} value={option[0]}>{option[1]}</option>
                } ,this)

                var vessel_options =
                Object.entries(this.state.vessel_options).map(function(option){
                    return <option key={option[0]} value={option[0]}>{option[1]}</option>
                } ,this)

                //console.log(this.state.cabintype_options);
                
                if(this.state.cabintype_options ){ 
                        var cabintype_options = Object.entries(this.state.cabintype_options).map(function(option){
                            return <option key={option[0]} value={option[0]}>{option[1]}</option>
                        } ,this)
                }else{
                        var cabintype_options = <option>None Available</option>
                }

                var itinerary_options =
                Object.entries(this.state.itinerary_options).map(function(option){
                    return <option key={option[0]} value={option[0]}>{option[1]}</option>
                } ,this)


            return (
        <div className="ibox-content form-thin-col border-top">

        <div className="form-group">
            <div className="col-md-2"><strong>Cruise operator</strong></div>
            <div className="col-md-2"><strong>Vessel name</strong></div>
            <div className="col-md-2"><strong>Cabin Type</strong></div>
            <div className="col-md-1"><strong>Cabin number</strong></div>
            <div className="col-md-1"><strong>Voyage itinerary</strong></div>
            <div className="col-md-2"><strong>Extra information</strong></div>
        </div>

        <div className="form-group">

            <div className="col-md-2">
                <select name="" value={this.state.operator_id} onChange={this.handleLimitCruiseList} className="form-control" name="alias_partner_as_operator_id">
                        {operator_options}
                </select>
            </div>

            <div className="col-md-2">
                <select name="" value={this.state.vessel_id} onChange={this.handleLimitCruiseList} className="form-control" name="vessel_id">
                    {vessel_options}
                </select>
            </div>

            <div className="col-md-2">
                <select name="" value={this.state.cabintype_id} onChange={this.handleLimitCruiseList} className="form-control" name="cabintype_id">
                    {cabintype_options}
                </select>
            </div>

            <div className="col-md-1">
                <input type="text" value={this.state.cabin_number} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="cabin_number" />
            </div>

            <div className="col-md-1">
                <select name="" value={this.state.itinerary_id} onChange={this.handleLimitCruiseList} className="form-control" name="alias_trip_as_itinerary_id">
                        {itinerary_options}
                </select>
            </div>

            <div className="col-md-4">
                <input type="text" value={this.state.extra_information} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="extra_information" />
            </div>

        </div>

    </div>
        );
  }
}

class PaymentDetails extends React.Component {
        constructor(props) {
                super(props);
                this.state = {};
        }

        render() {
                return (
         <div className="ibox-content form-thin-col border-top">
             <div className="form-group">
                 <div className="col-md-1"><strong>Date</strong></div>
                 <div className="col-md-3"><strong>Booking decription</strong></div>
                 <div className="col-md-2"><strong>Payment description</strong></div>
                 <div className="col-md-1"><strong>Currency</strong></div>
                 <div className="col-md-1"><strong>Amount</strong></div>
                 <div className="col-md-1"><strong>Fee</strong></div>
                 <div className="col-md-1"><strong>Expires</strong></div>
                 <div className="col-md-2"><strong>Status</strong></div>
             </div>
        <div className="form-group">
                <div className="col-md-1">
                    <div className="input-group date">
                        <span className="input-group-addon">
                            <i className="fa fa-calendar"></i>
                        </span>
                           <Calendar name={"payment"} value={this.props.payment} disabled placeholder={"Invoice month"} />
                   </div>
                </div>
                 <div className="col-md-3">
                     <input type="text" value={this.props.data.payment_description} placeholder="" disabled className="form-control " name="payment_description" />
                 </div>

                 <div className="col-md-2">
                        <select name="" value={this.props.data.payment_description} onBlur={this.props.handleBlur} onChange={this.props.handleChange} className="form-control" name="bookingitemtype_id">
                            <option key="0">Please Select.. </option>
                            <option key="1">Part Payment</option>
                            <option key="2">Deposit</option>
                            <option key="3">Full Payment</option>
                        </select>
                 </div>

                 <div className="col-md-1">
                     <input type="text" value={this.props.data.currency} placeholder="" className="form-control " name="currency" disabled />
                 </div>

                 <div className="col-md-1">
                     <input type="text" value={this.props.data.amount} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name=""  />
                 </div>

                 <div className="col-md-1">
                     <input type="text" value={this.props.data.fee} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="" />
                 </div>

                 <div className="col-md-1">
                     <div className="input-group date react-date">
                         <span className="input-group-addon">
                             <i className="fa fa-calendar"></i>
                         </span>
                         
                        <Calendar name="expires" value={this.props.expires}/>

                    </div>
                 </div>

                 <label htmlFor="" className="control-label text-muted text-left col-md-2">{this.props.data.payment_status}</label>

             </div>

             <div className="form-group">
                 <div className="col-md-2">
                     <a href="#" className="link-secondary"><i className="fa fa-plus"></i> Add payment link</a>
                 </div>

             </div>
        </div>

        )}
}

class BookingItem extends React.Component {
        constructor(props) {
            super(props);
                this.state = {};

                this.state.is_in_xero = this.props.data.is_in_xero;
        
                this.state.bookingitemtype_id = this.props.data.bookingitemtype_id;
                this.state.partner_id = this.props.data.partner_id;
                this.state.pax = this.props.data.pax;
                this.state.currency_id = this.props.data.currency_id;
                this.state.price_pax = this.props.data.price_pax;
                this.state.commission_percentage = this.props.data.commission_percentage;
        
                this.state.trip_id = this.props.data.trip_id;
                this.state.start_date = this.props.data.start_date;
                this.state.end_date = this.props.data.end_date;
                
                this.state.booking_item_type_options = this.props.booking_item_type_options;
                this.state.partner_options = this.props.partner_options;
                this.state.trip_options = this.props.trip_options;
                
                this.handleChange = this.handleChange.bind(this);
                this.handleDelete = this.handleDelete.bind(this);
                this.bookingItemTypeOptions = this.bookingItemTypeOptions.bind(this);
                this.handleBlur = this.handleBlur.bind(this);
                this.handleLimitedList = this.handleLimitedList.bind(this);
                this.handleCheckbox = this.handleCheckbox.bind(this);
                this.saveIfOne = this.saveIfOne.bind(this);
        }
      
        componentWillReceiveProps(){
                var booking_item_type_options = {}
                var partner_options = {}
                var trip_options = {}
                
                if( this.props.limitedFormOptions[this.props.data.id] !== undefined ){
                        var lfo = this.props.limitedFormOptions[this.props.data.id]; 
                        
                        this.state.booking_item_type_options = lfo.type_options ;
                        this.state.partner_options = lfo.partner_options ;
                        this.state.trip_options = lfo.trip_options;

                        //this.saveIfOne('bookingitemtype_ids', lfo.type_options );
                        //this.saveIfOne('partner_id', lfo.partner_options );
                        //this.saveIfOne('type_id', lfo.trip_options )
                        
                }else{
                        this.state.booking_item_type_options = this.props.booking_item_type_options;
                        this.state.partner_options = this.props.partner_options;
                        this.state.trip_options = this.props.trip_options;
                } 
        }
        
        saveIfOne(id, object) {
                console.log( 'saveIfOne' )
                
                var values = Object.values( object );
                if( values.length == 1 ) {
                        console.log( 'saveIfOne' ) 
                        this.props.saveBookingItemElement(id,
                                                          values[0],
                                                          this.props.enquiry_id,
                                                          this.props.data.booking_id,
                                                          this.props.data.id);
                }
        }
        
        componentDidMount() {
                var event = { target:{} }
                
                if( this.state.bookingitemtype_id != null ){
                        event.target.name = 'bookingitemtype_id'
                        event.target.value = this.state.bookingitemtype_id
                        this.limitedList(event);
                }
                if( this.state.partner_id != null ){
                        event.target.name = 'partner_id'
                        event.target.value = this.state.partner_id
                        this.limitedList(event);
                }
                if( this.state.trip_id != null ){
                        event.target.name = 'trip_id'
                        event.target.value = this.state.trip_id
                        this.limitedList(event);
                }  
        }

        handleChange(event) {
                //console.log('handleChange')
                //console.log( event.target.name )
                //console.log( event.target.value )

                if(event.target.name == 'is_in_xero'){
                        //console.log('name is in zero ');
                        //console.log( event.target.value );
                        //
                        //event.target.value = 'off';
                }
                
                this.props.saveBookingItemElement(event.target.name, event.target.value, this.props.enquiry_id, this.props.data.booking_id, this.props.data.id);
                
                this.setState( {[event.target.name]: event.target.value} );
                
                //this.forceUpdate();
                
        }

        handleBlur(event) {
                this.setState( {[event.target.name]: event.target.value} );
                
                var enquiry_id = this.props.enquiry_id;
                
                this.props.saveBookingItemElement(event.target.name, event.target.value, enquiry_id, this.props.data.booking_id, this.props.data.id);
                this.props.calculate(this.props.data.booking_id,event.target.name, event.target.value, this.props.data.id);

        }
        
        handleCheckbox(event){
                console.log('EVENT: ' +  event.target.value );
                
                this.setState( {[event.target.name]: event.target.value} );
                
                //if(event.target.name == 'is_in_xero'){
                //        console.log('event.target.name');
                //        event.target.value = false
                //}
                
                this.props.saveBookingItemElement(event.target.name, event.target.value, this.props.enquiry_id, this.props.data.booking_id, this.props.data.id);
        }

        handleDelete(event){
                this.props.deleteBookingItem(this.props.data.id);
                this.props.calculate(this.props.data.booking_id,event.target.name, event.target.value, this.props.data.id);

        }
        
        handleLimitedList(event){
                
                this.setState( {[event.target.name]: event.target.value} );
                this.props.saveBookingItemElement(event.target.name, event.target.value, this.props.enquiry_id, this.props.data.booking_id, this.props.data.id);
                this.limitedList(event);
        }
        
        limitedList(event){
                var enquiry_id = this.props.enquiry_id;
                
                var value = event.target.value;
                
                //for( var key in this.props.typeIds ){
                //        if( this.props.typeIds[key] == event.target.value ){
                //                value = key;
                //        }
                //}

                console.log('value')
                console.log(value)
                
                this.props.fetchLimitedList(event.target.name, value, this.props.data.id);     
        }
        
        bookingItemTypeOptions(){
                
                var ids = Object.values(this.props.bookingitems).map(function(detail){
                        return detail.bookingitemtype_id;
                }, this)
                
                var contains_flight = ids.indexOf( this.props.typeIds['flight'] ); 
                contains_flight = (contains_flight === 0);
                
                var contains_ground = ids.indexOf( this.props.typeIds['ground'] ); 
                var contains_cruise = ids.indexOf( this.props.typeIds['cruise'] );  
                var contains_not_flight = ( (contains_ground === 0) || (contains_cruise === 0) ); 
        
                var options = Object.entries(this.state.booking_item_type_options).map(function(option){
                        
                        var hide = false;
                        
                        // if flight is in the options, disable the others. 
                        if( contains_flight && option[0] != this.props.typeIds['flight'] ){
                                hide = true;
                        }
        
                        if(contains_not_flight && option[0] == this.props.typeIds['flight'] ){
                                hide = true;
                        }
                        
                        if(hide !== true){
                                return <option key={option[0]} value={option[0]}>{option[1]}</option> 
                        }
                        
                } ,this)
                
                return options;
        }

  render() {

        var booking_item_type_options = this.bookingItemTypeOptions()
        //console.log( booking_item_type_options )
        
        var partner_options =
        Object.entries(this.state.partner_options).map(function(option){
            return <option key={option[0]}
            value={option[0]}>{option[1]}</option>
        } ,this)
        
        var trip_options =
        Object.entries(this.state.trip_options).map(function(option){
            //console.log(option)
            return <option key={option[0]}
            value={option[0]}>{option[1]}</option>
        } ,this)

    return (
        <div ref="bookingitem">
                <div className="form-group">
                    <div className="col-md-1">
                        <select value={this.state.bookingitemtype_id} onChange={this.handleLimitedList} className="form-control" name="bookingitemtype_id">
                            <option value="0" >Please Select</option>
                            {booking_item_type_options}
                        </select>
                    </div>

                    <div className="col-md-1">
                        <select value={this.state.partner_id} onChange={this.handleLimitedList} className="form-control" name="partner_id">
                            {partner_options} 
                        </select>
                    </div>

                    <div className="col-md-1">
                        <input type="text" value={this.state.pax} onBlur={this.handleBlur} onChange={this.handleChange} placeholder="" className="form-control " name="pax" />
                    </div>

                    <div className="col-md-1">
                        <select name="" value={this.state.currency_id} onBlur={this.handleBlur} onChange={this.handleChange} className="form-control" name="currency_id">
                            {this.props.currency_options}
                        </select>
                    </div>

                    <div className="col-md-1">
                        <input type="text" value={this.state.price_pax} onBlur={this.handleBlur} onChange={this.handleChange} placeholder="" className="form-control " name="price_pax" />
                    </div>

                    <div className="col-md-1">
                        <input type="text" value={this.state.commission_percentage} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="commission_percentage" />
                    </div>

                    <div className="col-md-2">
                        <select name="" value={this.state.trip_id} onChange={this.handleLimitedList} className="form-control" name="trip_id">
                            {trip_options}
                        </select>
                    </div>

                        <div className="col-md-1">
                            <div className="input-group date react-date">
                                <span className="input-group-addon">
                                    <i className="fa fa-calendar"></i>
                                </span>

                                <Calendar name={"start_date"} value={this.state.start_date} handleBlur={this.handleBlur} handleChange={this.handleChange} />

                           </div>
                        </div>


                    <div className="col-md-1">

                        <div className="input-group date react-date">
                            <span className="input-group-addon">
                                <i className="fa fa-calendar"></i>
                            </span>
                            <Calendar name={"end_date"} value={this.state.end_date} handleBlur={this.handleBlur} handleChange={this.handleChange} />
                       </div>
                    </div>

                    <div className="col-md-1 text-centered">
                        <div className="checkbox custom-check">
                            <input type="checkbox" onChange={this.handleCheckbox} checked={this.state.is_in_xero} className="input-block-level"
                                name="is_in_xero"
                            />
                        <label htmlFor="is_in_xero"></label>
                        </div>
                    </div>


                    <div className="col-md-1 text-right">
                        <div onClick={ this.handleDelete } className="btn btn-danger btn-just-icon js-bf-bb-del-booking-item">
                            <i className="fa fa-trash" />
                        </div>
                    </div>

                </div>
    </div>

    );
  }
}

class InvoiceDetails extends React.Component {
        constructor(props) {
                super(props);

                this.lock = 'fa fa-lock';
                this.unlock = 'fa fa-unlock';

                // there won't always be booking or booking invoice props available
                var booking = this.props.data.booking !== undefined ? this.props.data.booking : [];
                this.state = {
                        invoice_number: booking.invoice_number,

                        };

                this.state.base_currency_id = this.props.invoiceDetail.base_currency_id;
                this.state.base_currency_amount = this.props.invoiceDetail.base_currency_amount;
                this.state.suggested_deposit_amount = this.props.invoiceDetail.suggested_deposit_amount;
                this.state.deposit_amount = booking.deposit_amount;
                this.state.base_currency_balance_amount = this.props.invoiceDetail.base_currency_balance_amount;
                this.state.balance_due = booking.balance_due;
                this.state.currency_id = this.props.data.booking.currency_id

                this.handleBlur = this.handleBlur.bind(this);
                this.handleChange = this.handleChange.bind(this);
                this.lockRate = this.lockRate.bind(this);
                this.showRates = this.showRates.bind(this);

        }

        componentWillMount(){
          //console.log(this.props);
                this.showRates();
                //This isn't working yet
                this.setState({
                  live_rate: this.props.exchangeRates[this.state.currency_id] * (1 / this.props.exchangeRates[this.props.invoiceDetail.base_currency_id])
                });
                console.log('this.props.invoiceDetail.base_currency_id:' + this.props.invoiceDetail.base_currency_id);
        }

        handleChange(event) {
                this.setState( {[event.target.name]: event.target.value} );
                if(event.target.name == 'currency_id'){
                  //Payment currency re-calculates on change, not blur
                  this.props.calculate(this.props.booking.id,event.target.name, event.target.value, null);
                }
        }

        handleBlur(event) {
                //console.log(this.props);
                this.props.saveBookingElement(event.target.name, event.target.value, this.props.enquiry_id, this.props.data.booking.id, null );
                if(event.target.name !== 'currency_id'){
                  //Payment currency re-calculates on change, not blur
                  this.props.calculate(this.props.booking.id,event.target.name, event.target.value, null);
                }
        }

        showRates(){
                if( this.props.booking.deposit_rate != null ){
                        console.log('if YES' );
                        this.setState( {
                                        lockIcon: this.lock,
                                        transactionRate: this.props.booking.deposit_rate,
                                        currencyDisabled: "disabled"
                                      } );
                }else{
                        console.log('if NO' );
                        this.setState( {lockIcon: this.unlock,
                                        transactionRate: this.props.exchangeRates[this.state.currency_id] * (1 / this.props.exchangeRates[this.props.invoiceDetail.base_currency_id]),
                                        currencyDisabled: ""
                                      } );
                }
        }

        lockRate(event){
                event.preventDefault();

                //console.log( 'this.props.booking.deposit_rate' )
                //console.log( this.props.booking.deposit_rate )

                if( this.props.booking.deposit_rate != null){
                        this.props.saveBookingElement('deposit_rate', null, this.props.enquiry_id, this.props.data.booking.id, null );
                }else{
                        this.props.saveBookingElement('deposit_rate', this.props.exchangeRates[this.state.currency_id], this.props.enquiry_id, this.props.data.booking.id, null );
                }

                this.showRates();
                this.forceUpdate();
        }



        render() {
                return (
        <div className="ibox-content form-thin-col border-top">
             <div className="form-group">{this.props.invoiceDetail.base_currency_id}

                     <label htmlFor="" className="control-label col-md-1">Invoice number</label>
                     <div className="col-md-1">
                         <input type="text" value={this.state.invoice_number} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="invoice_number" />
                     </div>

                     <label htmlFor="" className="control-label col-md-1">Subtotal ({this.props.currencySymbols[this.props.invoiceDetail.base_currency_id]})</label>
                     <div className="col-md-1">
                         <input type="text" value={this.props.invoiceDetail.base_currency_amount} placeholder="" className="form-control " name="" disabled />
                     </div>

                     <label htmlFor="" className="control-label col-md-1">Suggested deposit ({this.props.currencySymbols[this.props.invoiceDetail.base_currency_id]})</label>
                     <div className="col-md-1">
                         <input type="text" value={this.props.invoiceDetail.suggested_deposit_amount} placeholder="" className="form-control " name="" disabled />
                     </div>

                     <label htmlFor="" className="control-label col-md-1">Actual deposit ({this.props.currencySymbols[this.props.invoiceDetail.base_currency_id]})</label>
                     <div className="col-md-1">
                         <input type="text" value={this.state.deposit_amount} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="deposit_amount" />
                     </div>

                     <label htmlFor="" className="control-label col-md-1">Balance ({this.props.currencySymbols[this.props.invoiceDetail.base_currency_id]})</label>
                     <div className="col-md-1">
                         <input type="text" value={this.props.invoiceDetail.base_currency_balance_amount} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="" disabled />
                     </div>

                     <label htmlFor="" className="control-label col-md-1">Balance due (days prior)</label>
                     <div className="col-md-1">
                         <input type="text" value={this.state.balance_due} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="balance_due" />
                     </div>


             </div>

             <div className="form-group">

                     <label htmlFor="" className="control-label col-md-1">Customer currency</label>
                     <div className="col-md-1">
                        <select value={this.state.currency_id} onBlur={this.handleBlur} onChange={this.handleChange} disabled={this.state.currencyDisabled} className="form-control" name="currency_id">
                            {this.props.currency_options}
                        </select>
                     </div>

                     <label htmlFor="" className="control-label col-md-1">Subtotal ({this.props.currencySymbols[this.state.currency_id]})</label>
                     <div className="col-md-1">
                         <input type="text" value={this.props.invoiceDetail.payment_currency_amount} placeholder="" className="form-control " name="" disabled />
                     </div>

                     <label htmlFor="" className="control-label text-muted text-left col-md-2">Live exchange rate {this.props.exchangeRates[this.state.currency_id] * (1 / this.props.exchangeRates[this.props.invoiceDetail.base_currency_id])} </label>


                     <label htmlFor="" className="control-label col-md-1">Actual deposit ({this.props.currencySymbols[this.state.currency_id]})</label>
                     <div className="col-md-1">
                         <input type="text" value={this.props.invoiceDetail.payment_currency_deposit_amount} placeholder="" className="form-control " name="" disabled/>
                     </div>

                     <label htmlFor="" className="control-label text-muted text-left col-md-2">Transaction exchange rate {this.state.transactionRate } <i className={this.state.lockIcon} onClick={this.lockRate}></i></label>

                     <label htmlFor="" className="control-label col-md-1">Total Commission (GBP)</label>
                     <div className="col-md-1">
                       <input type="text" value={this.props.invoiceDetail.gbp_commission_total} placeholder="" className="form-control " name="" disabled/>
                      </div>
             </div>
         </div>
        )}
}

class Booking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
                
          };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.handleBookingStatus = this.handleBookingStatus.bind(this);
        this.bookingStatusCallback = this.bookingStatusCallback.bind(this);
        this.cancelCallback = this.cancelCallback.bind(this);
        
        //console.log('Booking id this.props ')
        //console.log(this.props)

        this.state.open = false;
        this.state.owner_id = this.props.row.booking.owner_id;
        this.state.booked_date = this.props.row.booking.booked_date;
        
        this.state.status = this.props.row.booking.status;
        this.state.bookingtype_id = this.props.row.booking.bookingtype_id;
        this.state.description = this.props.row.booking.description;
        
        }

        componentDidMount() {
                this.props.calculate(this.props.booking.booking.id,null,null,null);
        }

        

        handleChange(event) {
                this.setState( {[event.target.name]: event.target.value} );
        }

        handleBlur(event) {
                var enquiry_id = this.props.enquiry_id;
                this.props.saveBookingElement(event.target.name, event.target.value, enquiry_id, this.props.row.booking.id, null );
        }

        handleBookingStatus(event){

                if(event.target.value == 28){ // @todo edit hardcoded id's
                        this.setState( {open: true } );
                        console.log(this.state.open);
                }else{
                        this.setState( {[event.target.name]: event.target.value} );
                        var enquiry_id = this.props.enquiry_id;
                        this.props.saveBookingElement(event.target.name, event.target.value, enquiry_id, this.props.row.booking.id, null );
                }
        }

        bookingStatusCallback(){
                this.setState( {status: 28} );
                this.props.saveBookingElement('status', '28', this.props.enquiry_id, this.props.row.booking.id, null );
                this.setState( {open: false } )
        }
        
        cancelCallback(){
                this.setState({open: false });
        }
        
        
  render() {


    var rows = [];
    var lastCategory = null;

        var status_options =
        Object.entries(this.props.status_options).map(function(option){
            return <option key={option[0]}
            value={option[0]}>{option[1]}</option>
        } ,this)

        var owner_options =
        Object.entries(this.props.owner_options).map(function(option){
            return <option key={option[0]}
            value={option[0]}>{option[1]}</option>
        } ,this)

        var currency_options =
        Object.entries(this.props.currency_options).map(function(option){
            return <option key={option[0]}
            value={option[0]}>{option[1]}</option>
        } ,this);
        
        var booking_type_options =
        Object.entries(this.props.booking_type_options).map(function(option){         
            return <option key={option[0]} value={option[0]}>{option[1]}</option>
        } ,this)
        
        var CruiseDetailsList = [];

        var BookingsItemsList = Object.values(this.props.row.bookingitems).map( function(bookingitem){

                //console.log( 'this.props.itemDetails' )
                //console.log( this.props.itemDetails )
                //console.log( 'bookingitem.id' )
                //console.log( bookingitem.id )

                if( (bookingitem) && bookingitem.bookingitemtype_id == 3){  // cruise
                        CruiseDetailsList.push(<CruiseDetails
                                data={this.props.itemDetails[bookingitem.id]}
                                key={bookingitem.id}
                                bookingitem_id={bookingitem.id}
                                saveItemDetails={this.props.saveItemDetails}
                                itemDetails={this.props.itemDetails}
                                cabintype_options={this.props.cabintype_options}
                                itinerary_options={this.props.itinerary_options}
                                vessel_options={this.props.vessel_options}
                                operator_options={this.props.operator_options}
                                
                                fetchLimitedCruiseList={this.props.fetchLimitedCruiseList}
                                limitedCruiseFormOptions={this.props.limitedCruiseFormOptions}
                        />)
                }

                return <BookingItem data={bookingitem}
                        key={bookingitem.id}

                        calculate={this.props.calculate}

                        enquiry_id={this.props.enquiry_id}

                        currency_options={currency_options}
                        currencySymbols={this.props.currencySymbols}
                        trip_options={this.props.trip_options}

                        partner_options={this.props.partner_options}
                        booking_item_type_options={this.props.booking_item_type_options}
                        bookingitems={this.props.booking.bookingitems}

                        deleteBookingItem={this.props.deleteBookingItem}
                        saveBookingItemElement={this.props.saveBookingItemElement}
                        fetchLimitedList={this.props.fetchLimitedList}
                        limitedFormOptions={this.props.limitedFormOptions}
                        
                        
                        typeIds={this.props.typeIds}
                        
                        /> ;
        },
        this)

    var id = this.props.row.booking.id

    if(id === undefined){
        var invoicedetail = {};
    }else{
        var invoicedetail = this.props.invoiceDetails[id];
    }

    return (
        <div className="ibox border-bottom">
                <div className="ibox-title form-thin-col">
                    <div className="form-group">

                        <label htmlFor="" className="control-label col-md-4 text-left" >Booking <span className="js-bf-bb-booking-count"></span></label>

                        <span className="">
                            <label htmlFor="" className="control-label col-md-1">Sales Owner</label>
                            <div className="col-md-1">
                                <select value={this.state.owner_id} onChange={this.handleChange} onBlur={this.handleBlur} name="owner_id" className="form-control">
                                {owner_options}
                              </select>
                            </div>
                        </span>

                        <span className="">
                            <label htmlFor="" className="control-label col-md-1">Booking Type</label>
                            <div className="col-md-1">
                                <select name="bookingtype_id" value={this.state.bookingtype_id} onBlur={this.handleBlur} onChange={this.handleChange} className="form-control">
                                    {booking_type_options}
                                </select>
                            </div>
                        </span>

                        <span className="">
                            <label htmlFor="" className="control-label col-md-1">Booked Date</label>
                            <div className="col-md-1">
                                <div className="input-group date react-date">
                                    <span className="input-group-addon">
                                        <i className="fa fa-calendar"></i>
                                    </span>
                                    
                                <Calendar name={"booked_date"} value={this.state.booked_date} handleBlur={this.handleBlur} handleChange={this.handleChange} />

                                    
                               </div>
                            </div>

                        </span>

                        <ConfirmModal
                                open={this.state.open}
                                cancelCallback={this.cancelCallback}
                                confirmCallback={ this.bookingStatusCallback }
                                confirmText="Yes"
                                cancelText="No"

                                message=" Have you checked all information is correct? "
                                />

                        <span className="">
                            <label htmlFor="" className="control-label col-md-1">Booking Status</label>
                            <div className="col-md-1">
                                <select name="status" value={this.state.status} onChange={this.handleBookingStatus} className="form-control">
                                        {status_options}
                                </select>
                            </div>
                        </span>

                    </div>

                </div>
                <div className="ibox-content form-thin-col">


    <div className="form-group">
      <div className="col-md-1"><strong>Type</strong></div>
      <div className="col-md-1"><strong>Partner</strong></div>
      <div className="col-md-1"><strong>PAX</strong></div>
      <div className="col-md-1"><strong>Currency</strong></div>
      <div className="col-md-1"><strong>Per Person</strong></div>
      <div className="col-md-1"><strong>Comms %</strong></div>
      <div className="col-md-2"><strong>Trip</strong></div>
      <div className="col-md-1"><strong>Trip Start</strong></div>
      <div className="col-md-1"><strong>Trip End</strong></div>
      <div className="col-md-1 text-centered"><strong>In Xero</strong></div>
      <div className="col-md-1"><strong></strong></div>
    </div>
        {BookingsItemsList}
    <div className="form-group">
        <div className="col-md-2">
            <div onClick={() => this.props.addBookingItem(id)} className="link-secondary
            js-bf-bb-add-booking"><i className="fa fa-plus"></i> Add Booking Item</div>
        </div>
    </div>

</div>

        <div className="ibox-content form-thin-col border-top">
            <div className="form-group">
                <div className="col-md-12"><strong>Booking Description</strong></div>
            </div>

            <div className="form-group">
                <div className="col-md-8">
                    <input type="text" value={this.state.description} onBlur={this.handleBlur} onChange={this.handleChange}  placeholder="" className="form-control " name="description" />
                </div>
            </div>

        </div>
    {CruiseDetailsList}

    <InvoiceDetails
      data={this.props.row}
      booking={this.props.row.booking}
      invoiceDetail={this.props.invoiceDetails[id] }
      currency_options={currency_options}
      currencySymbols={this.props.currencySymbols}
      exchangeRates={this.props.exchangeRates}
      saveBookingElement={this.props.saveBookingElement}
      calculate={this.props.calculate}
      enquiry_id={this.props.enquiry_id}
      />

      <PaymentDetails data={this.props.row} />

</div>

    );
  }
}

class BookingsHeader extends React.Component {
        constructor(props) {
                super(props);
                this.state = {

                };

                this.handleBlur = this.handleBlur.bind(this);
                this.handleChange = this.handleChange.bind(this);
                
        }

        handleChange(event) {
            this.setState( {[event.target.name]: event.target.value} );
        }

        handleBlur(event) {
            this.props.saveHeaderElement(event.target.name, event.target.value, this.props.enquiry_id);
        }


        render() {
            return (
                <div className="row">
                    <div className="col-md-12">
                        <div className="ibox">
                            <div className="ibox-title">
                                <h5>Summary</h5>
                            </div>

                            <div className="ibox-content form-thin-col">

                                <div className="row">

                                    <div className="col-sm-2">

                                        <div className="form-group">
                                            <span className="">
                                                <label htmlFor="enquiry_ref" className="control-label col-md-6">Booking Ref</label>
                                                <div className="col-md-6">
                                                    <input type="text"
                                                      value={this.props.enquiry.enquiry_ref}
                                                      placeholder="Booking Ref"
                                                      className="form-control "
                                                      name="enquiry_ref"
                                                      disabled />
                                                </div>
                                            </span>
                                        </div>

                                    </div>

                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <span className="">
                                                <label htmlFor="departure_date" className="control-label col-md-6">Holiday Start</label>
                                                <div className="col-md-6">
                                                    <div className="input-group date react-date">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-calendar"></i>
                                                        </span>
                                                        
                                                        <Calendar placeholder="Holiday Start" name={"departure_date"} value={this.props.holidayDates.start_date} handleBlur={this.handleBlur} handleChange={this.handleChange} />

                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <span className="">
                                                <label htmlFor="return_date" className="control-label col-md-6">Holiday End</label>
                                                <div className="col-md-6">
                                                    <div className="input-group date react-date">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-calendar"></i>
                                                        </span>
                                                        
                                                        <Calendar placeholder="Holiday End" name={"return_date"} value={this.props.holidayDates.end_date} handleBlur={this.handleBlur} handleChange={this.handleChange} />

                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <span className="">
                                                <label htmlFor="booked_date" className="control-label col-md-6">Initial Booked Date</label>
                                                <div className="col-md-6">
                                                    <div className="input-group date react-date">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-calendar"></i>
                                                        </span>                                                               
                                                        <Calendar placeholder="Initial Booked Date" name={"initial_booked_date"} value={this.props.initial_booked_date} handleBlur={this.handleBlur} handleChange={this.handleChange} />

                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <span className="">
                                                <label htmlFor="estimated_total_trip_cost" className="control-label col-md-6">Estimated Total Trip Cost (USD)</label>
                                                    <div className="col-md-6">
                                                    <input type="text"
                                                           value={this.props.usd_total_trip_cost}
                                                           placeholder="Estimated Total Trip Cost (USD)"
                                                           className="form-control "
                                                           disabled />
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <span className="">
                                                <label htmlFor="estimated_total_trip_comm" className="control-label col-md-6">Estimated Total Comm (GBP)</label>
                                                    <div className="col-md-6">
                                                    <input type="text"
                                                           value={this.props.gbp_total_trip_commission}
                                                           placeholder="Estimated Total Comm (GBP)"
                                                           className="form-control "
                                                           disabled />
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
        );
  }
}

const Bookings = class Bookings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

  render() {

  //console.log('this.props.: ')
  //console.log(this.props)


    var BookingsList = Object.values(this.props.data).map(function(booking){

        //console.log('booking');
        //console.log( booking );

        return <Booking
                row={booking}
                saveItemDetails={this.props.saveItemDetails}
                itemDetails={this.props.itemDetails}
                invoiceDetails={this.props.invoiceDetails}
                formOptions={this.props.formOptions}
                typeIds={this.props.typeIds}
                booking={booking}

                owner_options={this.props.formOptions.owner_options}
                status_options={this.props.formOptions.status_options}
                currency_options={this.props.formOptions.currency_options}
                trip_options={this.props.formOptions.trip_options}
                cabintype_options={this.props.formOptions.cabintype_options}
                itinerary_options={this.props.formOptions.itinerary_options}
                vessel_options={this.props.formOptions.vessel_options}
                operator_options={this.props.formOptions.operator_options}
                partner_options={this.props.formOptions.partner_options}
                booking_item_type_options={this.props.formOptions.booking_item_type_options}
                booking_type_options={this.props.formOptions.booking_type_options}

                addBookingItem={this.props.addBookingItem}
                deleteBookingItem={this.props.deleteBookingItem}
                saveBookingItemElement={this.props.saveBookingItemElement}
                saveBookingElement={this.props.saveBookingElement}
                fetchLimitedList={this.props.fetchLimitedList}
                fetchLimitedCruiseList={this.props.fetchLimitedCruiseList}
                limitedFormOptions={this.props.limitedFormOptions}
                limitedCruiseFormOptions={this.props.limitedCruiseFormOptions}
                calculate={this.props.calculate}

                exchangeRates={this.props.exchangeRates}
                currencySymbols={this.props.currencySymbols}
                enquiry_id={this.props.enquiry_id}
                key={booking.booking.id}

                /> ;
    },
    this)
    return (
        <div>
          <BookingsHeader
            holidayDates={this.props.holidayDates} 
            enquiry={this.props.enquiry}
            saveHeaderElement={this.props.saveHeaderElement}
            usd_total_trip_cost={this.props.usd_total_trip_cost}
            gbp_total_trip_commission={this.props.gbp_total_trip_commission}
            />
            
          <div className="row">
            <div className="col-md-12">
                <div className="ibox">
                    <div className="ibox-title">
                        <h5>Sales Input</h5>
                    </div>
                    <div className="ibox-content">
                        {BookingsList}

                        <div onClick={ this.props.addBooking } className="btn btn-info js-bf-bb-add-booking"><i className="fa fa-plus"></i> Add Booking </div>
                    </div>

                </div>
            </div>
          </div>
        </div>
    );
  }
}


const mapStateToProps = state => {

  return {
    enquiry_id: enquiry_id.value,
    enquiry: state.enquiry,
    data: state.bookings,
    holidayDates: state.holidayDates,
    invoiceDetails: state.invoiceDetails,
    itemDetails: state.itemDetails,
    typeIds: state.typeIds, 
    formOptions: state.formOptions,
    limitedFormOptions: state.limitedFormOptions,
    limitedCruiseFormOptions: state.limitedCruiseFormOptions, 
    exchangeRates: state.exchangeRates,
    currencySymbols: state.currencySymbols,
    usd_total_trip_cost: state.usd_total_trip_cost,
    gbp_total_trip_commission:state.gbp_total_trip_commission,
    
  }
}

const mapDispatchToProps = (dispatch) => {
    return(
           {
             dispatch,
             addBooking: () => { dispatch( addBooking() ) },
             addBookingItem: (id) => { dispatch( {type: ADD_BOOKING_ITEM, id: id}) },
             calculate: (booking_id,element_name, value, bookingitem_id) => { dispatch({type: CALCULATE, booking_id: booking_id,element_name: element_name, value: value, bookingitem_id: bookingitem_id}) },
             deleteBookingItem: (id) => { dispatch( deleteBookingItem(id) ) },
             deleteBooking: () => { dispatch( {type: DELETE_BOOKING}) },
             saveBookingItemElement: (element_id, value, enquiry, booking_id, bookingitem_id) => { dispatch(saveBookingItemElement(element_id, value, enquiry, booking_id, bookingitem_id)) },
             saveBookingElement: (element_id, value, enquiry, booking_id, bookingitem_id) => { dispatch(saveBookingElement(element_id, value, enquiry, booking_id, bookingitem_id)) },
             saveItemDetails: (element_id, value, bookingitem_id, bookingitemdetail_id) => { dispatch(saveItemDetails(element_id, value,bookingitem_id, bookingitemdetail_id)) },
             saveHeaderElement: (element_id, value, enquiry_id) => { dispatch(saveHeaderElement(element_id, value, enquiry_id)) },
             getHolidayDates: (id) => { dispatch(getHolidayDates(id) ) },
             fetchLimitedList: (type, value, bookingitem_id) => { dispatch( fetchLimitedList(type, value, bookingitem_id) ) },
             fetchLimitedCruiseList: (type, value, bookingitemdetail_id) => { dispatch( fetchLimitedCruiseList(type, value, bookingitemdetail_id) ) },
        }
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
