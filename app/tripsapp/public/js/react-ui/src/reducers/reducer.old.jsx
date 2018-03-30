import update from 'immutability-helper';

import { combineReducers } from 'redux'

import {
  SET_ENQUIRY_ID,
  ADD_BOOKING, ADD_BOOKING_ITEM,
  UPDATE_BOOKING, UPDATE_BOOKING_ITEM,
  REQUEST_BOOKING_DATA, RECEIVE_BOOKING_DATA,
  REQUEST_FORM_OPTIONS, RECEIVE_FORM_OPTIONS,
  REQUEST_SAVE_ELEMENT, RECEIVE_SAVE_ELEMENT,
  DELETE_BOOKING_ITEM, DELETE_BOOKING,

  RECIEVE_DELETE_BOOKING_ITEM,
  RECEIVE_SAVE_BOOKING_ELEMENT,

  RECEIVE_SAVE_DETAILS,
  CALCULATE,
  REQUEST_EXCHANGE_RATES,
  RECEIVE_EXCHANGE_RATES,
  REQUEST_CURRENCY_DATA,
  RECEIVE_CURRENCY_DATA,
  REQUEST_ENQUIRY_DATA,
  RECEIVE_ENQUIRY_DATA,

  CALCULATE_TRIP_TOTALS, 

  REQUEST_HOLIDAY_DATES,
  RECIEVE_HOLIDAY_DATES,
  REQUEST_TYPE_IDS,
  RECIEVE_TYPE_IDS,
  
  REQUEST_LIMTED_LIST, 
  RECIEVE_LIMTED_LIST,
  REQUEST_LIMTED_CRUISE_LIST, 
  RECIEVE_LIMTED_CRUISE_LIST,
  
} from '../actions/actions.jsx'

const blankInvoiceDetail = {
  base_currency_amount: 0,
  base_currency_id: 0,
  currency_id: 0,
  deposit_rate: 0,
  currency_deposit_amount: 0,
  base_currency_deposit_amount: 0,
  balance_rate: 0,
  currency_balance_amount: 0,
  base_currency_balance_amount: 0,
  currency_amount: 0,
  invoice_number: 0,
  balance_due: 0
  };

const initialState = {
    bookings: {},
    itemDetails: {},
    enquiry:{
      enquiry_ref:'',
      departure_date: '',
      return_date: ''
    },

    usd_total_trip_cost: '',
    usd_total_trip_commission: '',
    inrequest: false,
    invoiceDetails: { 0: [blankInvoiceDetail] } ,

    limitedFormOptions: {},
    limitedCruiseFormOptions: {}, 
    
    lastReplacedBookingId: '',
    lastReplacedBookingItemId: '',
    lastReplacedBookingItemDetailId: '',
    
    formOptions: {
        owner_options:[],
        status_options: [],
        trip_options: [],
        currency_options: [],
        cust_currency_options: [],
        partner_options: [],
        booking_item_type_options: [],
        booking_type_options: [],
        operator_options:[],
        itinerary_options: [],
        vessel_options: [],
        cabintype_options: []
    },

    exchangeRates: [],
    
    holidayDates: {},
    typeIds: {}
}

export function bookingsReducer(state = initialState, action) {

    switch (action.type) {

      case SET_ENQUIRY_ID:
        return Object.assign({}, state, {
          enquiry_id : action.enquiry_id
        });

      case REQUEST_EXCHANGE_RATES:
        return Object.assign({}, state, {
            inxrequest : true
          });

      case RECEIVE_EXCHANGE_RATES:
        console.log('RECEIVE_EXCHANGE_RATES');
        var newstate = JSON.parse( JSON.stringify(state) );
        newstate.exchangeRates = action.data;
        return newstate;

        case REQUEST_CURRENCY_DATA:
          return Object.assign({}, state, {
              inxrequest : true
            });

        case RECEIVE_CURRENCY_DATA:
          console.log('RECEIVE_CURRENCY_DATA');
          var newstate = JSON.parse( JSON.stringify(state) );
          newstate.currencySymbols = action.data;
          return newstate;

      /**
       * Calculate invoice amounts for a single booking
       */
      case CALCULATE:
          var newstate = JSON.parse( JSON.stringify(state) );
          var booking = newstate.bookings[action.booking_id].booking;
          var bookingitems = newstate.bookings[action.booking_id].bookingitems;
          var bookingitem_id = action.bookingitem_id;

          var base_currency_subtotal = 0;


          //************ Determine base currency *******************
          var usd_currency_id = 2; //USD - @todo This should be a lookup
          var gbp_currency_id = 1; //GBP - @todo This should be a lookup
          var base_currency_id = usd_currency_id;
          var last_row_currency_id = 0;
          var row_currency_id;

          for(var i in bookingitems){
            //Iterate over each booking item
            //Either get currency ID from the action , or from the booking
            row_currency_id = action.element_name == 'currency_id' && action.bookingitem_id == i ? action.value : bookingitems[i].currency_id;

            if(row_currency_id < 1){
              //Ignore this row, it has no currency
              continue;
            }

            if(last_row_currency_id !== 0 && last_row_currency_id !== row_currency_id){
              //If this row does not match the previous (non-empty) row then currencies are mixed, default to usd and exit
              base_currency_id = usd_currency_id;
              break;
            }
            else{
              base_currency_id = row_currency_id;
            }

            last_row_currency_id = row_currency_id;
          }
          //@todo - Should be a lookup - convert away from CLP
          base_currency_id = base_currency_id == 5 ? usd_currency_id : base_currency_id;

          //Set the base currency rate from the base_currency_id determined from the bookingitems
          var base_currency_rate = newstate.exchangeRates[base_currency_id];

          // Set customer's payment currency - either used that passed in with the action, or the one set on the booking
          var payment_currency_id = action.element_name == 'currency_id' && action.bookingitem_id == undefined ? action.value : booking.currency_id;
          var payment_currency_rate = newstate.exchangeRates[payment_currency_id];

          //************ Do the calculations *******************
          var row_usd_subtotal = 0;
          var usd_subtotal = 0;
          var usd_comm_total = 0;
          var usd_commission_total = 0;
          var usd_suggested_deposit_amount = 0;
          var suggested_deposit_fraction = 4;

          for(var i in bookingitems){

            var row_currency_id = action.element_name == 'currency_id' && action.bookingitem_id == i ? action.value : bookingitems[i].currency_id;
            var row_pax = action.element_name == 'pax' && action.bookingitem_id == i ? action.value : bookingitems[i].pax;
            var row_price_pax = action.element_name == 'price_pax' && action.bookingitem_id == i ? action.value : bookingitems[i].price_pax;

            var row_commission_percentage = action.element_name == 'commission_percentage' && action.bookingitem_id == i ? action.value : bookingitems[i].commission_percentage;
            var row_bookingitemtype_id = action.element_name == 'bookingitemtype_id' && action.bookingitemtype_id == i ? action.value : bookingitems[i].bookingitemtype_id;

            if(row_currency_id < 1 || row_pax < 1 || row_price_pax < 1){
              //Ignore this row, it has missing data
              continue;
            }

            //Convert row amount to usd
            row_usd_subtotal = row_pax * row_price_pax / newstate.exchangeRates[row_currency_id];

            if(isNaN(row_usd_subtotal)){
              continue;
            }

            //Add to total
            usd_subtotal = usd_subtotal + row_usd_subtotal;

            //Calculate and add commission percentage
            if(row_commission_percentage > 0){
              usd_commission_total = usd_commission_total + (row_usd_subtotal * row_commission_percentage / 100);
            }

            //Calculate suggested deposit amount
            var suggested_deposit_fraction = row_bookingitemtype_id == 1 ? 1 : 4;
            usd_suggested_deposit_amount = usd_suggested_deposit_amount + (row_usd_subtotal / suggested_deposit_fraction);
          };

          //Calculate the base currency subtotal - take usd subtotal and use base currency rate to convert
          var base_currency_subtotal = usd_subtotal * base_currency_rate;

          //Get the subtotal in the payment currency
          var payment_currency_subtotal = usd_subtotal * payment_currency_rate;

          //Generate a suggested deposit amount, in payment currency
          var suggested_deposit_amount = !isNaN(usd_suggested_deposit_amount) ? Math.round(usd_suggested_deposit_amount) * base_currency_rate : '';

          //Put all of this data into the invoiceDetail object
          var invoiceDetail = {};

          //Base currency values
          invoiceDetail.base_currency_id = base_currency_id;
          invoiceDetail.base_currency_amount = !isNaN(base_currency_subtotal) ? Math.round(base_currency_subtotal) : '';

          invoiceDetail.base_currency_deposit_amount = !isNaN(booking.deposit_amount) ? Math.round(booking.deposit_amount / payment_currency_rate) : '';
          invoiceDetail.base_currency_balance_amount = Math.round(base_currency_subtotal - booking.deposit_amount);
          invoiceDetail.suggested_deposit_amount = !isNaN(suggested_deposit_amount) ? Math.round(suggested_deposit_amount) : '';

          //Payment currency values
          invoiceDetail.payment_currency_amount = !isNaN(payment_currency_subtotal) ? Math.round(payment_currency_subtotal) : '';
          invoiceDetail.payment_currency_deposit_amount = !isNaN(payment_currency_rate) ? Math.round(invoiceDetail.base_currency_deposit_amount * payment_currency_rate) : '';


          //Rates
          //invoiceDetail.deposit_rate = invoiceDetail.balance_rate = payment_currency_rate != undefined ? payment_currency_rate.toFixed(4) : null;

          //usd value for totals
          invoiceDetail.usd_currency_amount = !isNaN(usd_subtotal) ? Math.round(usd_subtotal) : '';
          invoiceDetail.usd_commission_total = !isNaN(usd_commission_total) ? Math.round(usd_commission_total) : '';

          //gbp commission total
          invoiceDetail.gbp_commission_total = !isNaN(usd_commission_total) ? Math.round(usd_commission_total * newstate.exchangeRates[gbp_currency_id]) : '';

          //Add invoiceDetail to state
          newstate.invoiceDetails[action.booking_id] = invoiceDetail;

          var usd_total_trip_cost = 0;
          var usd_total_trip_commission = 0;

          //Now do all of the totals calculations
          for(var i in newstate.invoiceDetails){
            if(newstate.invoiceDetails[i] != undefined){
              usd_total_trip_cost += newstate.invoiceDetails[i].usd_currency_amount;
              usd_total_trip_commission += newstate.invoiceDetails[i].usd_commission_total;
            }
          }

        var gbp_total_trip_commission = usd_total_trip_commission * newstate.exchangeRates[gbp_currency_id];

        newstate.usd_total_trip_cost = usd_total_trip_cost;
        newstate.usd_total_trip_commission = usd_total_trip_commission;
        newstate.gbp_total_trip_commission = !isNaN(gbp_total_trip_commission) ? Math.round(gbp_total_trip_commission) : '';

        return newstate

        /**
         * Request Booking data
         */
        case REQUEST_BOOKING_DATA:
          return Object.assign({}, state, {
            inrequest : true
          });

        case RECEIVE_BOOKING_DATA:
            console.log('RECEIVE_BOOKING_DATA');
            console.log(action);

            var invoiceDetails = [];

            Object.keys(action.data.bookings).map(function(booking_id){
                 invoiceDetails[booking_id] = blankInvoiceDetail;
            }, this)


            var bookings = {};
            if(action.data.bookings.length != 0 ){
              bookings = action.data.bookings;
            }

            return Object.assign({}, state, {
              bookings : bookings,
              inrequest : false,
              itemDetails: action.data.item_details,
              invoiceDetails: invoiceDetails
            })

            /**
             * Request Enquiry data
             */
            case REQUEST_ENQUIRY_DATA:
              return Object.assign({}, state, {
                inrequest : true
              });

            case RECEIVE_ENQUIRY_DATA:
                console.log('RECEIVE_ENQUIRY_DATA');
                console.log(action);

                return Object.assign({}, state, {
                  enquiry : action.data,
                  inrequest : false
                })

        /**
         * Request form data
         */
        case REQUEST_FORM_OPTIONS:
          return Object.assign({}, state, {
            formRequest : true
          })

        case RECEIVE_FORM_OPTIONS:
          return Object.assign({}, state, {
            formOptions : action.data,
            formRequest : false
          })

        /**
         * Add bookings
         */

        case ADD_BOOKING:
            console.log('bookingsreducer add booking');

            var newstate = JSON.parse( JSON.stringify(state) );

            var newbooking_id = 1000000;

            console.log(' ADD_BOOKING newstate.bookings')
            console.log(newstate.bookings)

            newstate.bookings[newbooking_id] = { bookingitems: { [newbooking_id]: { id:newbooking_id } }, booking: { id:newbooking_id } };
            newstate.invoiceDetails[newbooking_id] = [];

            console.log( 'newstate.invoiceDetails' );
            console.log( newstate.invoiceDetails );


            console.log( 'ADD BOOKING new state' );
            console.log(newstate );

          return newstate

        return addbooking

        case ADD_BOOKING_ITEM:
            console.log('bookingsreducer add booking item');
            var newstate = JSON.parse( JSON.stringify(state) );

            var newbookingitem_id = 1000000;
            newstate.bookings[action.id].bookingitems[newbookingitem_id] = {id:1000000, booking_id:action.id };

            console.log(' RED newstate.itemDetails')
            console.log( newstate.itemDetails )
            newstate.itemDetails[newbookingitem_id] = {};

            console.log(newstate );

          return newstate

        /**
         * Delete
         */
        case RECIEVE_DELETE_BOOKING_ITEM:
            var ad = action.data

            var newstate = JSON.parse( JSON.stringify(state) );

            console.log('action')
            console.log(action)

            if( ad.original_booking_id == null ){
              delete newstate.bookings[1000000]
            }else{
              delete newstate.bookings[ad.original_booking_id].bookingitems[ad.deleted_bookingitem_id]
            }

            console.log( 'DELETE' )
            console.log( newstate.bookings)

            // delete from
            if( newstate.bookings[ad.original_booking_id] !== undefined ){
              if( Object.keys(newstate.bookings[ad.original_booking_id].bookingitems).length == 0 ){
                delete newstate.bookings[ad.original_booking_id]
              }
            }

            console.log(newstate );

            return newstate;

        case REQUEST_SAVE_ELEMENT:
          return Object.assign({}, state, {
            savingElement: true
          })

        case RECEIVE_SAVE_ELEMENT:
            console.log('action');
            console.log(action.data);

            var ad = action.data

            var newstate = JSON.parse( JSON.stringify(state) );
            //var newstate = Object.assign({}, state);

            //console.log('newstate.bookings');
            //console.log(newstate.bookings);
            //
            //console.log('ad.original_booking_id');
            //console.log(ad.original_booking_id);
            //console.log('ad.original_bookingitem_id');
            //console.log(ad.original_bookingitem_id);
            //
            //console.log('ad.bookingitem_id');
            //console.log(ad.bookingitem_id);
            //console.log('ad.booking_id');
            //console.log(ad.booking_id);


            if( ad.original_booking_id == ''){
                console.log('deletes temp booking')
                ad.original_booking_id = 1000000;
                // deletes temp booking
                delete newstate.bookings[ad.original_booking_id];
                newstate.bookings[ad.booking_id] = {booking: { id: ad.booking_id }, bookingitems: {} };
                
                newstate.lastReplacedBookingId = ad.booking_id;
                
                // copy invoice details from tmp booking to new id.
                var tempInvoiceDetail = newstate.invoiceDetails[ad.original_booking_id];
                delete newstate.invoiceDetails[ad.original_booking_id];
                newstate.invoiceDetails[ad.booking_id] = tempInvoiceDetail
            }

            if( ad.original_bookingitem_id == ''){
                console.log('deletes temp booking item')
                ad.original_bookingitem_id = 1000000;
                // deletes temp booking item
                if( newstate.bookings[ad.original_booking_id] !== undefined ){
                    delete newstate.bookings[ad.original_booking_id].bookingitems[ad.original_bookingitem_id]
                }
                newstate.bookings[ad.booking_id].bookingitems[ad.bookingitem_id] = { id: ad.bookingitem_id, booking_id: ad.booking_id};
                
                
                newstate.lastReplacedBookingItemId = ad.bookingitem_id;
            }



            // add new element
            newstate.bookings[ad.booking_id].bookingitems[ad.bookingitem_id][ad.element] = ad.value;

            console.log('newstate.bookings');
            console.log(newstate.bookings);

            return newstate



        case RECEIVE_SAVE_BOOKING_ELEMENT:
            console.log('RECEIVE_SAVE_BOOKING_ELEMENT')
            var ad = action.data

            var newstate = JSON.parse( JSON.stringify(state) );
            //var newstate = Object.assign({}, state);

            if( ad.original_booking_id == ''){
                ad.original_booking_id = 1000000;
                // deletes temp booking
                delete newstate.bookings[ad.original_booking_id];
            }

            if( newstate.bookings[ad.booking_id].booking === undefined){
                console.log('here ');
                newstate.bookings[ad.booking_id].booking = {};
            }

            //console.log( 'newstate.bookings[ad.booking_id]' );
            //console.log( newstate.bookings[ad.booking_id] );
            //
            //console.log( 'newstate.bookings[ad.booking_id].booking' );
            //console.log( newstate.bookings[ad.booking_id].booking );
            //
            //console.log( 'newstate.bookings[ad.booking_id].booking[ad.element]' );
            //console.log( newstate.bookings[ad.booking_id].booking[ad.element] );


            newstate.bookings[ad.booking_id].booking[ad.element] = ad.value;
            return newstate;

        case RECEIVE_SAVE_DETAILS:
            console.log('RECEIVE_SAVE_DETAILS')
            var ad = action.data

            var newstate = JSON.parse( JSON.stringify(state) );

            console.log(' newstate.itemDetails[ad.bookingitem_id] ')
            console.log( newstate.itemDetails[ad.bookingitem_id] )

            if( (newstate.itemDetails[ad.bookingitem_id] === undefined) || (newstate.itemDetails[ad.bookingitem_id] === null) ){
                newstate.itemDetails[ad.bookingitem_id] = {};
            }
            
            newstate.lastReplacedBookingItemDetailId = ad.bookingitem_id;

            console.log('action.data')
            console.log(action.data)

            newstate.itemDetails[ad.bookingitem_id][ad.element] = ad.value;
            newstate.itemDetails[ad.bookingitem_id]['id'] = ad.bookingitemdetail_id
            return newstate;

        //case REQUEST_HOLIDAY_DATES:
          
        case RECIEVE_HOLIDAY_DATES:
          
          var newstate = Object.assign({}, state, {
            holidayDates: action.data[0]
          })
          
          return newstate;
        
        case RECIEVE_TYPE_IDS:
          console.log('action.data')
          console.log(action.data)
          
          
          var newstate = Object.assign({}, state, {
            typeIds: action.data
          })
          
          return newstate;
        
        case RECIEVE_LIMTED_LIST:
          console.log('action.data')
          console.log(action.data)

          console.log('action.bookingitem_id')
          console.log(action.bookingitem_id)
          
          var newstate = JSON.parse( JSON.stringify(state) );
          
          console.log('newstate.lastReplacedBookingId')
          console.log(newstate.lastReplacedBookingId)
          
          var id = 0;
          if(action.bookingitem_id == 1000000 ){
            id = newstate.lastReplacedBookingId;
          }else{
            id = action.bookingitem_id;
          }
          
          if( newstate.limitedFormOptions[id] === undefined ){
            newstate.limitedFormOptions[id] = {}
          }
          
          newstate.limitedFormOptions[id] = action.data;
          
          console.log(' FOOOOOOOO ')
          console.log(newstate.limitedFormOptions);
          
          return newstate;
        
        
        case RECIEVE_LIMTED_CRUISE_LIST:
          console.log('action.data')
          console.log(action.data)

          console.log('action.bookingitemdetail_id')
          console.log(action.bookingitemdetail_id)
          
          var newstate = JSON.parse( JSON.stringify(state) );
          
          var id = 0;
          if(action.bookingitemdetail_id == 1000000 ){
            id = newstate.lastReplacedBookingItemDetailId;
          }else{
            id = action.bookingitemdetail_id;
          }
          
          if( newstate.limitedCruiseFormOptions[id] === undefined ){
            newstate.limitedCruiseFormOptions[id] = {}
          }
          
          newstate.limitedCruiseFormOptions[id] = action.data;
          
          //console.log(' newstate.limitedCruiseFormOptions foo ')
          //console.log(newstate.limitedCruiseFormOptions);
          
          return newstate;
        
        default:
          console.log( 'Reducer - GOT UNEXPECTED ACTION TYPE ' + action.type );
          return state;
      }

  return state
}

// export const allReducers = combineReducers({
//   bookingInvoiceReducer,
//   bookingsReducer
// })
