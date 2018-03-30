
export const ADD_BOOKING = 'ADD_BOOKING'
export const ADD_BOOKING_ITEM = 'ADD_BOOKING_ITEM'

export const REQUEST_DELETE_BOOKING_ITEM = 'REQUEST_DELETE_BOOKING_ITEM'
export const RECIEVE_DELETE_BOOKING_ITEM = 'RECIEVE_DELETE_BOOKING_ITEM'

export const REQUEST_SAVE_ELEMENT = 'REQUEST_SAVE_ELEMENT'
export const RECEIVE_SAVE_ELEMENT = 'RECEIVE_SAVE_ELEMENT'
export const RECEIVE_SAVE_BOOKING_ELEMENT = 'RECEIVE_SAVE_BOOKING_ELEMENT'
export const RECEIVE_SAVE_DETAILS = 'RECEIVE_SAVE_DETAILS'

export const REQUEST_BOOKING_DATA = 'REQUEST_BOOKING_DATA'
export const RECEIVE_BOOKING_DATA = 'RECEIVE_BOOKING_DATA'

export const REQUEST_FORM_OPTIONS = 'REQUEST_FORM_OPTIONS'
export const RECEIVE_FORM_OPTIONS = 'RECEIVE_FORM_OPTIONS'

export const REQUEST_EXCHANGE_RATES = 'REQUEST_EXCHANGE_RATES'
export const RECEIVE_EXCHANGE_RATES = 'RECEIVE_EXCHANGE_RATES'

export const REQUEST_CURRENCY_DATA = 'REQUEST_CURRENCY_DATA';
export const RECEIVE_CURRENCY_DATA = 'RECEIVE_CURRENCY_DATA';

export const REQUEST_ENQUIRY_DATA = 'REQUEST_ENQUIRY_DATA'
export const RECEIVE_ENQUIRY_DATA = 'RECEIVE_ENQUIRY_DATA'

export const CALCULATE = 'CALCULATE'

export const REQUEST_HOLIDAY_DATES = "REQUEST_HOLIDAY_DATES";
export const RECIEVE_HOLIDAY_DATES = "RECIEVE_HOLIDAY_DATES";

export const REQUEST_TYPE_IDS = "REQUEST_TYPE_IDS";
export const RECIEVE_TYPE_IDS = "RECIEVE_TYPE_IDS";

export const REQUEST_LIMTED_LIST = "REQUEST_LIMTED_LIST";
export const RECIEVE_LIMTED_LIST = "RECIEVE_LIMTED_LIST";

export const REQUEST_LIMTED_CRUISE_LIST = "REQUEST_LIMTED_CRUISE_LIST";
export const RECIEVE_LIMTED_CRUISE_LIST = "RECIEVE_LIMTED_CRUISE_LIST";

export function addBooking(){
  return dispatch => {
    dispatch( {type: ADD_BOOKING} )

    dispatch( {type: ADD_BOOKING_ITEM, id: 1000000} )
  }
}

/*
 * Enquiry data async action creators
 */
export function requestEnquiryData(id){
  // ajax get data
  return {
    type: REQUEST_ENQUIRY_DATA,
  }
}

export function receiveEnquiryData(json){
    return {
      type: RECEIVE_ENQUIRY_DATA,
      data: json
    }
}

/*
* Fetch payload of data for a single enquiry
*/
export function fetchEnquiryData(id) {
  return dispatch => {
    dispatch( requestEnquiryData(id) )
    return fetch('/sw2sys/bookings/get_json_enquiry_data/' + id, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => dispatch(receiveEnquiryData(json)))
  }
}



/*
 * Booking data async action creators
 */
export function requestBookingData(id){
  // ajax get data
  return {
    type: REQUEST_BOOKING_DATA,
  }
}

export function receiveBookingData(json){
    return {
      type: RECEIVE_BOOKING_DATA,
      data: json
    }
}

export function fetchBookingData(enquiry_id) {
  return dispatch => {
    dispatch( requestBookingData(enquiry_id) )
    return fetch('/sw2sys/bookings/get_json_booking_data/' + enquiry_id, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => dispatch(receiveBookingData(json)))
  }
}

/*
 * Form options async action creators
 */
export function requestFormOptions(id){
  return {
    type: REQUEST_FORM_OPTIONS,
  }
}

export function receiveFormOptions(json){
    return {
      type: RECEIVE_FORM_OPTIONS,
      data: json
    }
}

export function fetchFormOptions(id) {
  return dispatch => {
    dispatch( requestFormOptions(id) )
    return fetch('/sw2sys/bookings/get_json_prepare_form_data', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => dispatch(receiveFormOptions(json)))
  }
}

/*
 * Exchange rate async action creators
 * Exchange rates fetched from the server are relative to USD base currency
 */
export function requestExchangeRates(){
  return {
    type: REQUEST_EXCHANGE_RATES,
  }
}

export function receiveExchangeRates(json){
    return {
      type: RECEIVE_EXCHANGE_RATES,
      data: json
    }
}

export function fetchExchangeRates() {
  return dispatch => {
    dispatch( requestExchangeRates() )
    return fetch('/sw2sys/bookings/get_json_exchange_rates', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => dispatch(receiveExchangeRates(json)))
  }
}

/*
 * Form options async action creators
 */
export function requestCurrencyData(){
  return {
    type: REQUEST_CURRENCY_DATA,
  }
}

export function receiveCurrencyData(json){
    return {
      type: RECEIVE_CURRENCY_DATA,
      data: json
    }
}

export function fetchCurrencyData() {
  return dispatch => {
    dispatch( requestCurrencyData() )
    return fetch('/sw2sys/bookings/get_json_currency_data', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => dispatch(receiveCurrencyData(json)))
  }
}

/**
 * Save element async action creators
 */
export function requestSaveElement(){
  return {
    type: REQUEST_SAVE_ELEMENT
  }
}

export function receiveSavedElement(json){
  return {
    type: RECEIVE_SAVE_ELEMENT,
    data: json
  }
}

export function receiveSavedBooking(json){
  return {
    type: RECEIVE_SAVE_BOOKING_ELEMENT,
    data: json
  }
}

export function saveElement(URL, element_id, value, enquiry, booking_id, bookingitem_id, callback) {
  console.log( 'URL: ' . URL )
  if(booking_id == 1000000){
    booking_id = '';
  }
  if(bookingitem_id == 1000000){
    bookingitem_id = '';
  }

  return dispatch => {
    dispatch( requestSaveElement() );

    var json = JSON.stringify({
        element: element_id,
        value: value,
        enquiry_id: enquiry,
        booking_id: booking_id,
        bookingitem_id: bookingitem_id
      })

    console.log('json');
    console.log(json);

    return fetch(URL, {
      method: 'POST',
      credentials: 'include',
      body: json,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( callback(json) ) )
  }

}

export function saveBookingItemElement(element_id, value, enquiry, booking_id, bookingitem_id) {
  return saveElement('/sw2sys/booking_items/json_save/', element_id, value, enquiry, booking_id, bookingitem_id, receiveSavedElement );
}

export function saveBookingElement(element_id, value, enquiry, booking_id, bookingitem_id) {
  return saveElement('/sw2sys/bookings/json_save/', element_id, value, enquiry, booking_id, bookingitem_id, receiveSavedBooking);
}

export function receiveSavedDetails(json){
  return {
    type: RECEIVE_SAVE_DETAILS,
    data: json
  }
}

export function saveItemDetails(element_id, value, bookingitem_id, bookingitemdetail_id) {

  if(bookingitem_id == 1000000){
    bookingitem_id = '';
  }

  return dispatch => {
    dispatch( requestSaveElement() );

    var json = JSON.stringify({
        element: element_id,
        value: value,
        bookingitem_id: bookingitem_id,
        bookingitemdetail_id: bookingitemdetail_id
      });

    console.log('json');
    console.log(json);

    return fetch('/sw2sys/booking_item_details/json_save/', {
      method: 'POST',
      credentials: 'include',
      body: json,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( receiveSavedDetails(json) ) )
  }

}

/**
 * Delete booking item
 */

export function requestdeleteBookingItem(id){
  return {
    type: REQUEST_DELETE_BOOKING_ITEM,
    id: id
  }
}


export function receiveDeleteBookingItem(json){
  return {
    type: RECIEVE_DELETE_BOOKING_ITEM,
    data: json
  }
}

export function deleteBookingItem( id ) {

  return dispatch => {
    dispatch( requestdeleteBookingItem() );

    var json = JSON.stringify({ id: id })

    console.log('json');
    console.log(json);

    return fetch('/sw2sys/booking_items/json_delete/', {
      method: 'POST',
      credentials: 'include',
      body: json,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( receiveDeleteBookingItem(json) ) )
  }

}

/**
 * get hoiliday dates
 */

export function requestHolidayDates(){
  return {
    type: REQUEST_HOLIDAY_DATES
  }
}


export function receiveHolidayDates(json){
  return {
    type: RECIEVE_HOLIDAY_DATES,
    data: json
  }
}


export function getHolidayDates( id ) {

  return dispatch => {
    dispatch( requestHolidayDates() );

    return fetch('/sw2sys/enquiries/json_get_holiday_dates/' + id, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( receiveHolidayDates(json) ) )
  }

}

/**
 * Get id's for bookingitem types
 *
 */

export function requestTypeIds(){
  return {
    type: REQUEST_TYPE_IDS
  }
}


export function receiveTypeIds(json){
  return {
    type: RECIEVE_TYPE_IDS,
    data: json
  }
}

export function fetchTypeIds() {

  return dispatch => {
    dispatch( requestTypeIds() );

    return fetch('/sw2sys/booking_item_types/json_get', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( receiveTypeIds(json) ) )
  }

}

/***
 * get lists limited by selection of other list
 *
 */

export function requestLimitedList(){
  return {
    type: REQUEST_LIMTED_LIST
  }
}
 

export function receiveLimitedList(json, bookingitem_id){
  return {
    type: RECIEVE_LIMTED_LIST,
    data: json,
    bookingitem_id: bookingitem_id
  }
}

export function fetchLimitedList(type, value, bookingitem_id) {
  return dispatch => {
    dispatch( requestLimitedList() );

    return fetch('/sw2sys/bookings/get_json_limited_lists/?' + type + '=' + value,   // $type, $partner, $trip
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( receiveLimitedList(json, bookingitem_id) ) )
  }

}

/***
 * get cruise details selection lists limited by selection of other lists
 *
 */

export function requestLimitedCruiseList(){
  return {
    type: REQUEST_LIMTED_CRUISE_LIST 
  }
}
 

export function receiveLimitedCruiseList(json, bookingitemdetail_id){
  return {
    type: RECIEVE_LIMTED_CRUISE_LIST,
    data: json,
    bookingitemdetail_id: bookingitemdetail_id
  }
}

export function fetchLimitedCruiseList(type, value, bookingitemdetail_id) {
  return dispatch => {
    dispatch( requestLimitedCruiseList() );

    return fetch('/sw2sys/bookings/get_json_limited_cruise_lists/?' + type + '=' + value,   // $type, $partner, $trip
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => dispatch( receiveLimitedCruiseList(json, bookingitemdetail_id) ) )
  }

}