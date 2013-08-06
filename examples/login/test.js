var body = '{ title: null, \
  first_name: null, \
  middle_name: null, \
  last_name: null, \
  suffix: null, \
  address: null, \
  address2: null, \
  city: null, \
  state: null, \
  zip: null, \
  phone_number: null, \
  mobile_number: null, \
  gender: null, \
  marital_status: null, \
  is_parent: null, \
  is_retired: null, \
  is_veteran: null, \
  is_student: null, \
  email: 'joseph.polastre@gsa.gov', \
  id: 'a44d2d36-f7de-47be-b557-a81367cb5048' }';

console.log(body);
var json = JSON.parse(body);
console.log(json);
